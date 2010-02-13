# begin
#   require File.join(File.dirname(__FILE__), '.bundle', 'environment')
# rescue LoadError
#   require 'bundler'
#   Bundler.setup
# end
#
# Bundler.require :default

require File.join(File.dirname(__FILE__),'vendor','gems','environment')
Bundler.require_env

configure do

  require 'sass/plugin'
  Sass::Plugin.options[:load_paths] = [Sinatra::Application.views]

  ENV['TZ'] = 'Australia/Sydney'

  set :app_file => 'poacher.rb'
end
