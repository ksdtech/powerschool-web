require 'csv'

# Convert output of racecodes.csv TLIST_SQL to a flat file of student custom fields

STUDENT_HEADER = [:student_number, :xschoolid, :xenroll_status, :xfirst_name, :xlast_name].freeze
RACE_HEADER = [:race_declined, :race_700, :race_100, :race_400, :race_600,
  :race_201, :race_202, :race_203, :race_204, :race_205, :race_206, :race_207, :race_208, :race_299, 
  :race_301, :race_302, :race_303, :race_304, :race_399].freeze
ALL_HEADER = (STUDENT_HEADER + RACE_HEADER).freeze

data = { }

CSV.foreach('/Users/pz/Desktop/racecodes.csv',
  headers: true, 
  header_converters: :symbol) do |row|
  sn = row[:student_number]
  if sn
    data[sn] ||= { }
    STUDENT_HEADER.each do |key|
      data[sn][key] = row[key]
    end
    racecd = row[:racecd]
    if racecd
      data[sn]["race_#{racecd}".to_sym] = 1
    end
  end
end

CSV.open('/Users/pz/Desktop/race_import.csv', 'wb', force_quotes: true) do |csv|
  csv << ALL_HEADER
  data.keys.sort.each do |sn|
    row = ALL_HEADER.map { |key| data[sn].fetch(key, nil) }
    csv << row
  end
end
