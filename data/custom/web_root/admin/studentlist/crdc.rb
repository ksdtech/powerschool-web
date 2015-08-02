require 'csv'

CENSUS_DATE = '2013-10-03'

def race_category(hisp, races)
  return 'hispanic' if hisp
  return nil if races.empty?
  if races.size == 1
    code = (races[0].to_i / 100)*100
    case code
    when 100
      return 'native'
    when 200
      return 'asian'
    when 300
      return 'pacific'
    when 400
      return 'filipino'
    when 600
      return 'black'
    when 700
      return 'white'
    else
      raise "what? #{races[0]}"
    end
  end
  return '2-or-more'
end

students = { }
schools = { }
CSV.foreach('./data/enrollment13.csv', 
  row_sep: "\n", col_sep: ",",
  headers: true, header_converters: :symbol) do |row|
  rdata = row.to_hash
  sn = rdata[:student_number]
  next unless sn
  lep = nil
  hisp = rdata[:xeth] == '1' ? '1' : nil
  ela = rdata[:xela]
  schoolid = rdata[:xschoolid]
  raise "whoa schoolid #{sn}" unless schoolid

  schools[schoolid] = '1'
  case ela
  when 'EL'
    lep = '1'
  when 'RFEP'
    eladate = rdata[:xeladate]
    if eladate 
      m, d, y = eladate.split('/').map { |e| e.to_i }
      if y < 100
        if y > 90
          y += 1900
        else
          y += 2000
        end
      end
      eladate = sprintf("%04d-%02d-%02d", y, m, d)
      if eladate > CENSUS_DATE
        lep = '1'
      end
    end
  end
  students[sn] = rdata.update(lep: lep, eth: nil, hisp: hisp, races: [], sped: nil, has504: nil)
end

racecodes = { }
CSV.foreach('./data/racecodes.csv', 
  row_sep: "\n", col_sep: ",",
  headers: true, header_converters: :symbol) do |row|
  rdata = row.to_hash
  sn = rdata[:student_number]
  next unless sn
  if students.key?(sn)
    race = rdata[:xracecd]
    students[sn][:races] << race
  else
    # $stderr.puts "could not find #{sn}"
  end
end

CATS = ['hispanic', 'native', 'asian', 'pacific', 'filipino', 'black', 'white', '2-or-more']
GENDERS = [ 'M', 'F' ]

schools.keys.each do |schoolid|
  schools[schoolid] = { }
  schools[schoolid][:lep] = [ 0, 0 ]
  schools[schoolid][:sped] = [ 0, 0 ]
  schools[schoolid][:has504] = [ 0, 0 ]
  schools[schoolid][:cats] = CATS.map { |cat| [ 0, 0, cat ] }
end

students.keys.each do |sn|
  students[sn][:eth] = race_category(students[sn][:hisp], students[sn][:races])
  cat = students[sn][:eth] || 'white'
  gender = students[sn][:xgender]
  schoolid = students[sn][:xschoolid]

  catind = CATS.find_index(cat)
  raise "whoa cat #{cat}" if catind.nil?
  genind = GENDERS.find_index(gender)
  raise "whoa gender #{gender}" if genind.nil?
  count = schools[schoolid][:cats][catind][genind]
  schools[schoolid][:cats][catind][genind] = count+1

  lep = students[sn][:lep]
  if lep
    count = schools[schoolid][:lep][genind]
    schools[schoolid][:lep][genind] = count+1
  end

  sped = students[sn][:sped]
  if sped
    count = schools[schoolid][:lep][genind]
    schools[schoolid][:lep][genind] = count+1
  end
end

schools.keys.each do |schoolid|
  puts "school: #{schoolid}"

  totalm = 0
  totalf = 0
  schools[schoolid][:cats].each do | mcount, fcount, cat |
    puts "  #{cat}-M: #{mcount}"
    puts "  #{cat}-F: #{fcount}"
    totalm += mcount
    totalf += fcount
  end

  puts "lep-M: #{schools[schoolid][:lep][0]}"
  puts "lep-F: #{schools[schoolid][:lep][1]}"

  puts "sped-M: #{schools[schoolid][:sped][0]}"
  puts "sped-F: #{schools[schoolid][:sped][1]}"

  puts "total-M: #{totalm}"
  puts "total-F: #{totalf}"
  puts "total: #{totalm + totalf}"
  puts ""
end

