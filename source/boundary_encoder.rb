#!/usr/bin/env ruby

# Google Maps polyline encoder in ruby
require 'polylines'

WEB_ROOT = '/Users/pz/Projects/_active/powerschool-web/data/custom/web_root/'
pts = [ ]
File.open(WEB_ROOT + 'scripts/ksdlimits.js') do |f|
  while line = f.gets do
    line.chomp!
    next unless m = line.match(/^new\s+google\.maps\.LatLng\(\s*([-.0-9]+)[,\s]+([-.0-9]+)\s*\)/)
    lat = m[1].to_f
    lng = m[2].to_f
    puts "#{lat}, #{lng}"
    pts << [ lat, lng ]
  end
end

result = Polylines::Encoder.encode_points(pts)
puts result
