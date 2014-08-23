require 'csv'
require 'json'

"
student_number
web_id
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
    'web_id',
    'family_id',
    'surname',
    'first_name',
    'last_name',
    'reg_will_attend'
  ].map { |f| f.to_sym }

  STU_FIELDS = [
    'student_number',
    'web_id',
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
    @listings = [ ]
    @unlisted = [ ]
    @exited = [ ]
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

  def get_parents(home_p, sid, i)
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
  
    s = @student_by_sid[sid]
    if !s[PARENT_FIELDS[i+0]]
      street = s[PARENT_FIELDS[i+1]] || ''
      city   = s[PARENT_FIELDS[i+2]] || ''
      state  = s[PARENT_FIELDS[i+3]] || ''
      zip    = s[PARENT_FIELDS[i+4]] || ''
    end

    home_p[:street] = street
    home_p[:city]   = city
    home_p[:state]  = state
    home_p[:zip]    = zip
    
    # must have all parameters to show
    if !(street == '' || city == '' || state == '' || zip == '')
      # html-ize it
      street += (', ' + city + ', ' + state + ' ' + zip)
    end
  
    home_p[:address_line] = street
  
    # parents
    if !s[PARENT_FIELDS[i+5]]
      mfirst = s[PARENT_FIELDS[i+6]] || ''
      mlast = s[PARENT_FIELDS[i+7]] || ''
    end
    if !s[PARENT_FIELDS[i+8]]
      ffirst = s[PARENT_FIELDS[i+9]] || ''
      flast = s[PARENT_FIELDS[i+10]] || ''
    end
    home_p[:mother_first] = mfirst
    home_p[:mother_last]  = mlast
    home_p[:father_first] = ffirst
    home_p[:father_last]  = flast
    
    if mlast != '' && flast != ''
      if mlast != flast
        parents = mfirst + ' ' + mlast + ' and ' + ffirst + ' ' + flast
        home_p[:mother_part] = mfirst + ' ' + mlast
        home_p[:father_part] = ffirst + ' ' + flast
      else
        parents = mfirst + ' and ' + ffirst + ' ' + flast
        home_p[:mother_part] = mfirst
        home_p[:father_part] = ffirst + ' ' + flast
      end
      mabbr = mfirst[0, 1] + '.'
      fabbr = ffirst[0, 1] + '.'
      if mabbr == fabbr
        mabbr = mfirst
        fabbr = ffirst
      end
    elsif mlast != ''
      parents = mfirst + ' ' + mlast
    elsif flast != ''
      parents = ffirst + ' ' + flast
    end
    home_p[:mother_abbr] = mabbr
    home_p[:father_abbr] = fabbr
    home_p[:parent_line] = parents
    
    result << [ parents ]
    result << [ street ]
  
    if !s[PARENT_FIELDS[i+11]]
      mmail = s[PARENT_FIELDS[i+12]] || ''
    end
    if !s[PARENT_FIELDS[i+13]]
      fmail = s[PARENT_FIELDS[i+14]] || ''
    end
    home_p[:mother_email] = mmail
    home_p[:father_email] = fmail
    
    all_mails = [ ]
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
    result << all_mails
  
    if !s[PARENT_FIELDS[i+15]]
      hphone = s[PARENT_FIELDS[i+16]] || ''
    end
    if !s[PARENT_FIELDS[i+17]]
      mcell = s[PARENT_FIELDS[i+18]] || ''
    end
    if !s[PARENT_FIELDS[i+19]]
      fcell = s[PARENT_FIELDS[i+20]] || ''
    end
    home_p[:home_phone] = hphone
    home_p[:mother_cell] = mcell
    home_p[:father_cell] = fcell
    
    all_phones = [ ]
    if mcell != ''
      if mcell == hphone
        mcell = ''
      elsif mcell == fcell
        fcell = ''
      else
        if mabbr != ''
          mcell += ' (' + mabbr + ')'
        end
      end
    end
    home_p[:mother_cell_line] = mcell
    if fcell != ''
      if fcell == hphone
        fcell = ''
      else
        if fabbr != ''
          fcell += ' (' + fabbr + ')'
        end
      end
    end
    all_phones << mcell if mcell != ''
    all_phones << fcell if fcell != ''
    home_p[:father_cell_line] = fcell
    if hphone != ''
      all_phones = [ hphone ] + all_phones
    end
    home_p[:all_phones] = all_phones
    result << all_phones
    result
  end

  def get_preview(lfid)
    surname, fid = lfid.split(':')
    
    preview = { }
    preview[:surname] = surname
    preview[:family_id] = fid
    
    preview_student = nil
    any_approved = false
    last_approved = nil
    last_names = [ ]
    
    # no preview if any unlisted
    @students_by_fid[fid].each do |sid|
      s = @student_by_sid[sid]
      if s[:kikdir_unlisted]
        $stderr.puts "student #{s[:student_number]} is unlisted"
        preview[:unlisted_student] = copy_fields(s, STU_FIELDS)
        preview_student = nil
        break
      end
      if s[:kikdir_at]
        any_approved = true
        if !last_approved || s[:kikdir_at] > last_approved
          last_approved = s[:kikdir_at]
          preview_student = sid
        end
      end
    end
    
    if !preview_student
      $stderr.puts "unlisted - no preview"
      return preview
    end
  
    sibs, sib_data = get_sibling_data(lfid)
    preview[:surname] = surname
    preview[:approved] = any_approved
    preview[:approved_student] = preview_student
    preview[:approval_date] = last_approved
    preview[:siblings] = [ ]
    
    sib_names = [ ]
    sibs.each_with_index do |sid, i|
      the_sib = sib_data[sid]
      sib_names << the_sib[:preview_name]
      preview[:siblings] << the_sib
    end
  
    a1 = [ surname + ' ' + sib_names.join(', ') ]
    b1 = [ ]
    home_p = { }
    home  = get_parents(home_p, preview_student, PRIMARY_PARENTS)
    0.upto(2) do |i|
      a1 += home[i] if !home[i].empty?
    end
    b1 += home[3] if !home[3].empty?
    preview[:a1] = a1
    preview[:b1] = b1
  
    a2 = [ ]
    b2 = [ ]
    home2_p = { }
    home2 = get_parents(home2_p, preview_student, SECONDARY_PARENTS)
    0.upto(2) do |i|
      a2 += home2[i] if !home2[i].empty?
    end
    b2 += home2[3] if !home2[3].empty?
    preview[:a2] = a2
    preview[:b2] = b2
    
    preview[:homes] = [ home_p, home2_p ]
    return preview
  end

  # import all @student_by_sid from csv
  def parse(fname)
    CSV.foreach(fname, :col_sep => "\t", :row_sep => "\n", :headers => true,
      :header_converters => :symbol) do |row|
      s = row.to_hash
      
      sid = s[:student_number]
      wid = s[:web_id]
      m = wid.match(/^([A-Z0-9]{8})\.[0-9]{6}$/)
      raise "bad web_id #{wid} for student #{sid}" unless m
      fid = m[1]
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
          @listings << p
        end
      end
    end
  end
  
  def output
    puts JSON.pretty_generate({ :exited => @exited, :unlisted => @unlisted, :listings => @listings })
  end
end

ke = KikExporter.new
ke.parse('/Users/pz/Desktop/students.txt')
ke.output

