require 'csv'

families = { }

CSV.foreach('approved.txt', headers: true,
  header_converters: :symbol, col_sep: "\t", row_sep: "\n") do |row|
  fam_id = row[:family_ident]
  next unless fam_id
  families[fam_id] ||= { approved: nil, unlisted: nil, students: [ ] }
  families[fam_id][:students] << row.to_h
  families[fam_id][:approved] = 1 if row[:kikdir_approved]
  families[fam_id][:unlisted] = 1 if row[:kikdir_unlisted]
end

print("student_number\txfamily_ident\tkikdir_unlisted\txkikdir_approved\n")
families.each do |fam_id, v|
  approved = nil
  unlisted = v[:unlisted] ? 'Y' : nil
  if !unlisted && v[:approved]
    approved = '1'
    unlisted = 'N'
  end
  v[:students].each do |row|
    print("#{row[:student_number]}\t#{fam_id}\t#{unlisted}\t#{approved}\n")
  end
end

