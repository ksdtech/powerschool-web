require 'csv'
require 'json'

"
student_number
family_ident
first_name
last_name
kikdir_unlisted
kikdir_approved
kikdir_at
reg_will_attend
reg_grade_level
nickname
kikdir_home_addr
street
city
state
zip
kikdir_mother_name
mother_first
mother
kikdir_father_name
father_first
father
kikdir_mother_email
mother_email
kikdir_father_email
father_email
kikdir_home_phone
home_phone
kikdir_mother_cell
mother_cell
kikdir_father_cell
father_cell
kikdir_home2_addr
home2_street
home2_city
home2_state
home2_zip
kikdir_mother2_name
mother2_first
mother2_last
kikdir_father2_name
father2_first
father2_last
kikdir_mother2_email
mother2_email
kikdir_father2_email
father2_email
kikdir_home2_phone
home2_phone
kikdir_mother2_cell
mother2_cell
kikdir_father2_cell
father2_cell
form4_updated_at
"

class KikExporter
  
  PRIMARY_PARENTS = 0
  SECONDARY_PARENTS = 21

  PARENT_FIELDS = [ 
    'kikdir_home_addr',
    'street',
    'city',
    'state',
    'zip',
    'kikdir_mother_name',
    'mother_first',
    'mother',
    'kikdir_father_name',
    'father_first',
    'father',
    'kikdir_mother_email',
    'mother_email',
    'kikdir_father_email',
    'father_email',
    'kikdir_home_phone',
    'home_phone',
    'kikdir_mother_cell',
    'mother_cell',
    'kikdir_father_cell',
    'father_cell',
    'kikdir_home2_addr',
    'home2_street',
    'home2_city',
    'home2_state',
    'home2_zip',
    'kikdir_mother2_name',
    'mother2_first',
    'mother2_last',
    'kikdir_father2_name',
    'father2_first',
    'father2_last',
    'kikdir_mother2_email',
    'mother2_email',
    'kikdir_father2_email',
    'father2_email',
    'kikdir_home2_phone',
    'home2_phone',
    'kikdir_mother2_cell',
    'mother2_cell',
    'kikdir_father2_cell',
    'father2_cell'
  ].map { |f| f.to_sym }

  EXITED_FIELDS = [
    'student_number',
    'family_id',
    'surname',
    'first_name',
    'last_name',
    'reg_will_attend'
  ].map { |f| f.to_sym }

  STU_FIELDS = [
    'student_number',
    'family_id',
    'surname',
    'first_name',
    'last_name',
    'reg_will_attend',
    'reg_grade_level',
    'grade_level',
    'kikdir_unlisted',
    'kikdir_approved',
    'kikdir_at'
  ].map { |f| f.to_sym }

  def initialize
    @surnames = [ ]
    @families_by_surname = { }
    @student_by_sid = { }
    @students_by_fid = { }
    @unlisted = [ ]
    @unapproved = [ ]
    @listings = [ ]
    @exited = [ ]
    @conflicts = [ ]
    
    # flag to export unlisted families
    @export_unlisted = true
    # flag to reject or export unapproved families
    @export_unapproved = true
    # flag to use all contacts for unapproved students
    @merge_unapproved = true
    # flag to use the last updated student instead of merging
    @use_last_updated = false
  end
  
  def copy_fields(s, fields)
    data = fields.inject({}) { |h, f| h[f] = s[f]; h }
    data
  end

  def get_sibling_data(lfid)
    surname, fid = lfid.split(':')

    # filter on surname
    sibs = [ ]
    sib_names = [ ]
    sib_data = { }
    @students_by_fid[fid].each do |sid|
      s = @student_by_sid[sid]
      if surname == s[:surname]
        if !sib_data.key?(sid)
          sibs << sid
          sib_data[sid] = copy_fields(s, STU_FIELDS)
        end
      end
    end
  
    # Sort by grade and name
    sibs.sort! do |a, b| 
      cmp = sib_data[a][:grade_level] <=> sib_data[b][:grade_level]
      cmp = sib_data[a][:first_name] <=> sib_data[b][:first_name] if cmp == 0
      cmp
    end
  
    sibs.each_with_index do |sid, i|
      the_sib = sib_data[sid]
      grade = the_sib[:reg_grade_level]
      sib_data[sid][:preview_name] = "#{the_sib[:first_name]} (#{the_sib[:reg_grade_level]})"
    end
    return [ sibs, sib_data ]
  end

  def get_parents(lfid, home_p, sid_list, i)
    result   = [ ]
    street   = ''
    city     = ''
    state    = ''
    zip      = ''
    mfirst   = ''
    mlast    = ''
    ffirst   = ''
    flast    = ''
    mabbr    = ''
    fabbr    = ''
    parents  = ''
    mmail    = ''
    fmail    = ''
    hphone   = ''
    mcell    = ''
    fcell    = ''
  
    all = { }
    sid_list.each do |sid|
      s = @student_by_sid[sid]
      all[sid] = { }
      all[sid][:unlisted_phones] = [ ]
      all[sid][:unlisted_emails] = [ ]
      
      if s[PARENT_FIELDS[i+0]]
        $stderr.puts("#{lfid} #{i == 0 ? 'primary' : 'secondary'} address not listed")
      else
        street = s[PARENT_FIELDS[i+1]] || ''
        city   = s[PARENT_FIELDS[i+2]] || ''
        state  = s[PARENT_FIELDS[i+3]] || ''
        zip    = s[PARENT_FIELDS[i+4]] || ''
      end

      all[sid][:street] = street
      all[sid][:city]   = city
      all[sid][:state]  = state
      all[sid][:zip]    = zip
    
      # must have all parameters to show
      if !(street == '' || city == '' || state == '' || zip == '')
        # html-ize it
        street += (', ' + city + ', ' + state + ' ' + zip)
      end
      all[sid][:address_line] = street
  
      # parents
      if !s[PARENT_FIELDS[i+5]]
        mfirst = s[PARENT_FIELDS[i+6]] || ''
        mlast = s[PARENT_FIELDS[i+7]] || ''
      end
      if !s[PARENT_FIELDS[i+8]]
        ffirst = s[PARENT_FIELDS[i+9]] || ''
        flast = s[PARENT_FIELDS[i+10]] || ''
      end
      all[sid][:mother_first] = mfirst
      all[sid][:mother_last]  = mlast
      all[sid][:father_first] = ffirst
      all[sid][:father_last]  = flast
    
      if mlast != '' && flast != ''
        if mlast != flast
          parents = mfirst + ' ' + mlast + ' and ' + ffirst + ' ' + flast
          all[sid][:mother_part] = mfirst + ' ' + mlast
          all[sid][:father_part] = ffirst + ' ' + flast
        else
          all[sid][:mother_part] = mfirst
          all[sid][:father_part] = ffirst + ' ' + flast
        end
        mabbr = mfirst[0, 1] + '.'
        fabbr = ffirst[0, 1] + '.'
        if mabbr == fabbr
          mabbr = mfirst
          fabbr = ffirst
        end
      elsif mlast != ''
        all[sid][:mother_part] = mfirst + ' ' + mlast
      elsif flast != ''
        all[sid][:father_part] = ffirst + ' ' + flast
      end
      all[sid][:mother_abbr] = mabbr
      all[sid][:father_abbr] = fabbr
    
      if !s[PARENT_FIELDS[i+11]]
        mmail = s[PARENT_FIELDS[i+12]] || ''
      end
      if !s[PARENT_FIELDS[i+13]]
        fmail = s[PARENT_FIELDS[i+14]] || ''
      end
      all[sid][:mother_email] = mmail
      all[sid][:father_email] = fmail
  
      ph = s[PARENT_FIELDS[i+16]]
      if ph
        if s[PARENT_FIELDS[i+15]]
          all[sid][:unlisted_phones] << ph unless all[sid][:unlisted_phones].include?(ph)
        else
          hphone = ph
        end
      end
      ph = s[PARENT_FIELDS[i+18]]
      if ph
        if s[PARENT_FIELDS[i+17]]
          all[sid][:unlisted_phones] << ph unless all[sid][:unlisted_phones].include?(ph)
        else
          mcell = ph
        end
      end
      ph = s[PARENT_FIELDS[i+20]]
      if ph
        if s[PARENT_FIELDS[i+19]]
          all[sid][:unlisted_phones] << ph unless all[sid][:unlisted_phones].include?(ph)
        else
          fcell = ph
        end
      end
      all[sid][:home_phone] = hphone
      all[sid][:mother_cell] = mcell
      all[sid][:father_cell] = fcell
    end
    
    if sid_list.size == 0
      # empty result
      $stderr.puts("#{lfid} #{i == 0 ? 'primary' : 'secondary'} no students - empty result")
      return result
    end
    
    conflicts = [ ]
    high_student = nil
    if sid_list.size == 1
      # simple case
      high_student = sid_list[0]
    else
      cmp_keys = [
        :address_line, :home_phone,
        :mother_first, :mother_last, :mother_part, :mother_abbr,
        :mother_email, :mother_cell, 
        :father_first, :father_last, :father_part, :father_abbr,
        :father_email, :father_cell ]
        
      test = { }
      cmp_keys.each do |key|
        test[key] = []
      end
      
      high_score = -1
      sid_list.each do |sid|
        score = 0
        cmp_keys.each do |key|
          val = all[sid][key] || ''
          unless val.nil? || val.empty?
            score += 1
            test[key] << val unless test[key].include?(val)
          end
        end
        if score > high_score
          high_score = score
          high_student = sid
        end
      end
      cmp_keys.each do |key|
        if test[key].size > 1
          conflicts << "#{i == 0 ? 'primary' : 'secondary'} #{key.to_s}: #{test[key].join('; ')}"
        end
      end
    end

    home_p.update(all[high_student])
    
    unless conflicts.empty?
      $stderr.puts("#{lfid} #{i == 0 ? 'primary' : 'secondary'} has conflicts")
      home_p[:conflicts] = conflicts
    end
    
    parents = ''
    if home_p[:mother_part] && home_p[:father_part]
      parents = home_p[:mother_part] + ' and ' + home_p[:father_part]
    elsif home_p[:mother_part]
      parents = home_p[:mother_part]
    else 
      parents = home_p[:father_part]
    end
    home_p[:parent_line] = parents || ''

    mabbr = home_p[:mother_abbr] || ''
    fabbr = home_p[:father_abbr] || ''
    
    all_mails = [ ]
    mmail = home_p[:mother_email] || ''
    fmail = home_p[:father_email] || ''
    if mmail != ''
      if mmail == fmail
        fmail = ''
      else
        if mabbr != ''
          mmail += ' (' + mabbr + ')'
        end
      end
    end
    home_p[:mother_email_line] = mmail
    if fmail != ''
      if fabbr != ''
        fmail += ' (' + fabbr + ')'
      end
    end
    home_p[:father_email_line] = fmail
    all_mails << mmail if mmail != ''
    all_mails << fmail if fmail != ''
    home_p[:all_emails] = all_mails
    
    all_phones = [ ]
    hphone = home_p[:home_phone] || ''
    mcell = home_p[:mother_cell] || ''
    fcell = home_p[:father_cell] || ''
    if mcell != ''
      # removed per Laurie decision 9/10/2014
      # if mcell == hphone
      #   mcell = ''
      # elsif mcell == fcell
      if mcell == fcell
        fcell = ''
      else
        if mabbr != ''
          mcell += ' (' + mabbr + ')'
        end
      end
    end
    home_p[:mother_cell_line] = mcell
    if fcell != ''
      # removed per Laurie decision 9/10/2014
      # if fcell == hphone
      #   fcell = ''
      # else
      if fabbr != ''
        fcell += ' (' + fabbr + ')'
      end
    end
    all_phones << mcell if mcell != ''
    all_phones << fcell if fcell != ''
    home_p[:father_cell_line] = fcell
    if hphone != ''
      all_phones = [ hphone ] + all_phones
    end
    home_p[:all_phones] = all_phones
    
    result << (home_p[:parent_line].empty? ? [] : [ home_p[:parent_line] ])
    result << (home_p[:address_line].empty? ? [] : [ home_p[:address_line] ])
    result << home_p[:all_emails]
    result << home_p[:all_phones]
    result
  end

  def get_preview(lfid)
    surname, fid = lfid.split(':')
    
    preview = { }
    preview[:surname] = surname
    preview[:family_id] = fid
    
    any_approved = false
    last_approved = nil
    last_updated = nil
    oldest_grade_level = -1
    approved_student = nil
    last_updated_student = nil
    oldest_student = nil
    all_students = [ ]
    last_names = [ ]
    
    # no preview if any unlisted
    @students_by_fid[fid].each do |sid|
      s = @student_by_sid[sid]
      if s[:kikdir_unlisted]
        preview[:unlisted_student] = copy_fields(s, STU_FIELDS)
        $stderr.puts "#{lfid} student #{preview[:unlisted_student][:student_number]} is unlisted"
        return preview
      end
      all_students << sid
      
      # test: use last updated student
      updated_at = s[:form4_updated_at]
      if updated_at && (last_updated.nil? || updated_at > last_updated)
        last_updated = updated_at
        last_updated_student = sid
      end

      # test: use oldest student
      grade_level = s[:grade_level].to_i
      if grade_level > oldest_grade_level
        oldest_grade_level = grade_level
        oldest_student = sid
      end
      
      if s[:kikdir_at]
        any_approved = true
        if !last_approved || s[:kikdir_at] > last_approved
          last_approved = s[:kikdir_at]
          approved_student = sid
        end
      end
    end
    
    preview_students = nil
    if approved_student 
      preview_students = [approved_student]
    elsif @use_last_updated && last_updated_student
      $stderr.puts("#{lfid}: unapproved, using student #{last_updated_student} updated #{last_updated}")
      preview_students = [last_updated_student]
    elsif @merge_unapproved
      $stderr.puts("#{lfid}: unapproved, merging all students")
      preview_students = all_students
    else
      $stderr.puts("#{lfid}: unapproved, using student #{oldest_student} from grade #{oldest_grade_level}")
      preview_students = [oldest_student]
    end
    
    sibs, sib_data = get_sibling_data(lfid)
    preview[:surname] = surname
    preview[:approved] = any_approved
    preview[:approved_student] = approved_student
    preview[:preview_students] = preview_students.join(',')
    preview[:approval_date] = last_approved
    preview[:siblings] = [ ]
    
    sib_names = [ ]
    sibs.each_with_index do |sid, i|
      the_sib = sib_data[sid]
      sib_names << the_sib[:preview_name]
      preview[:siblings] << the_sib
    end

    if !approved_student
      preview[:approved] = false
      unless @export_unapproved
        return preview
      end
    end
  
    # TODO: combine primary and secondary home info 
    # TODO: hide any phone that's marked unlisted by either primary or secondary
    # TODO: produce unique parent abbreviations (primary and secondary)
    a1 = [ surname + ' ' + sib_names.join(', ') ]
    b1 = [ ]
    home_p = { }
    home = get_parents(lfid, home_p, preview_students, PRIMARY_PARENTS)
    0.upto(2) do |i|
      a1 += home[i] if !home[i].empty?
    end
    b1 += home[3] if !home[3].empty?
    preview[:a1] = a1
    preview[:b1] = b1
  
    a2 = [ ]
    b2 = [ ]
    home2_p = { }
    home2 = get_parents(lfid, home2_p, preview_students, SECONDARY_PARENTS)
    0.upto(2) do |i|
      a2 += home2[i] if !home2[i].empty?
    end
    b2 += home2[3] if !home2[3].empty?
    preview[:a2] = a2
    preview[:b2] = b2
    
    
    preview[:homes] = [ home_p, home2_p ]
    unlisted_phones = (home_p[:unlisted_phones] + home2_p[:unlisted_phones]).uniq
    preview[:homes].each_with_index do |home, i|
      [:home_phone, :mother_cell, :father_cell].each do |key|
        ph = home.fetch(key)
        if ph && unlisted_phones.include?(ph)
          $stderr.puts("#{lfid}: phone problem: #{ph} home[#{i}][#{key.to_s}] was also marked unlisted")
        end
      end
    end
    
    if home_p[:conflicts] || home2_p[:conflicts]
      preview[:conflicts] = []
      preview[:conflicts] += home_p[:conflicts] if home_p[:conflicts]
      preview[:conflicts] += home2_p[:conflicts] if home2_p[:conflicts]
    end
    return preview
  end

  # import all @student_by_sid from csv
  def parse(fname)
    CSV.foreach(fname, :col_sep => "\t", :row_sep => "\n", :headers => true,
      :header_converters => :symbol) do |row|
      s = row.to_hash
      
      sid = s[:student_number]
      fid = s[:family_ident]
      m = fid.match(/^([A-Z0-9]{8})$/)
      raise "bad family_ident #{fid} for student #{sid}" unless m
      s[:family_id] = fid
      
      # set 'first_name' to nickname if nickname is given
      if s[:nickname]
        s[:first_name] = s[:nickname]
      end

      surname = s[:last_name].upcase
      s[:surname] = surname

      # skip non-returning students
      status = s[:reg_will_attend]
      if status && status.match(/^nr-/)
        @exited << copy_fields(s, EXITED_FIELDS)
      else
        # set 'grade_level' to integer of 'reg_grade_level' with TK and K = 0
        if s[:reg_grade_level] =~ /^[1-8]$/
          s[:grade_level] = s[:reg_grade_level].to_i
        else
          s[:grade_level] = 0
        end
      
        @student_by_sid[sid] = s
        if !@students_by_fid.key?(fid)
          @students_by_fid[fid] = [ ]
        end
        @students_by_fid[fid] << sid
    
        if !@families_by_surname.key?(surname)
          @families_by_surname[surname] = [ ]
        end
        lfid = "#{surname}:#{fid}"
        if !@families_by_surname[surname].include?(lfid)
          @families_by_surname[surname] << lfid
        end
      end
    end
    
    @exited.sort! do |a,b| 
      a[:surname] <=> b[:surname]
    end
    
    @surnames = @families_by_surname.keys.sort
    @surnames.each do |surname|
      @families_by_surname[surname].sort.each do |lfid|
        p = get_preview(lfid)
        if p.key?(:unlisted_student)
          @unlisted << p
        else
          # family can be unapproved, but still listed!
          if @export_unapproved || p[:approved]
            @listings << p
          end
          if !p[:approved]
            @unapproved << p
          end
          if p[:conflicts]
            @conflicts << p
          end
        end
      end
    end
  end
  
  def output
    json_object = { 
      :exited => @exited, 
      :unlisted => @export_unlisted ? @unlisted : [ ],
      :unapproved => @export_unapproved ? [ ] : @unapproved, 
      :listings => @listings,
      :conflicting => @conflicts
    }
    puts JSON.pretty_generate(json_object)

    $stderr.puts("#{@exited.size} exited")
    $stderr.puts("#{@unlisted.size} unlisted")
    $stderr.puts("#{@unapproved.size} unapproved")
    $stderr.puts("#{@listings.size} listings")
    $stderr.puts("#{@conflicts.size} with conflicts")
    total = @exited.size + @unlisted.size + @listings.size
    total += @unapproved.size unless @export_unapproved
    $stderr.puts("#{total} total")
  end
end

ke = KikExporter.new
ke.parse('/Users/pz/Desktop/students.txt')
ke.output

