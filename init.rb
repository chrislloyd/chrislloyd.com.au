require 'rubygems'
ENV['TZ'] = 'Australia/Sydney'

# Declare gems via the .gems file
File.file?(gems_file = "#{File.dirname(__FILE__)}/.gems") && File.read(gems_file).each do |gem_decl|
  gem_name, version = gem_decl[/^([^\s]+)/,1], gem_decl[/--version ([^\s]+)/,1]
  version ? gem(gem_name, version) : gem(gem_name)
end
require 'sinatra'
require 'haml'
require 'sass'
require 'rdiscount'
require 'app'

require 'sass/plugin'
Sass::Plugin.options[:load_paths] = [Sinatra::Application.views]


# TODO Escape HTML by default
# set :haml => {:escape_html => true, :attr_wrapper => '"', :format => :html4}
set :haml => {:attr_wrapper => '"', :format => :html4}
set :app_file => 'app.rb'

require 'lib/article'

Article.path = 'articles'
