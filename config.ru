ENV['TZ'] = 'Australia/Sydney'
require 'rubygems'

File.file?(gems_file = "#{File.dirname(__FILE__)}/.gems") && File.read(gems_file).each do |gem_decl|
  gem_name, version = gem_decl[/^([^\s]+)/,1], gem_decl[/--version ([^\s]+)/,1]
  version ? gem(gem_name, version) : gem(gem_name)
end

require 'sinatra'
require 'haml'
require 'rdiscount'
require 'app'

run Sinatra::Application
