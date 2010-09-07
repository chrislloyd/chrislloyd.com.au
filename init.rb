ENV['RACK_ENV'] ||= 'development'

require 'rubygems'
require 'bundler'
Bundler.setup :default, ENV['RACK_ENV'].to_sym
Bundler.require :default, ENV['RACK_ENV'].to_sym

require './database'

configure do
  set :app_file => 'poacher.rb'
  set :haml => {:format => :html5}
  set :sass => {:load_paths => [File.join(Sinatra::Application.public,'sass')]}
end

configure :production do
  ENV['APP_ROOT'] ||= File.dirname(__FILE__)
end
