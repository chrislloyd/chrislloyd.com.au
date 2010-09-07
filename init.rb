ENV['RACK_ENV'] ||= 'development'

require 'rubygems'
require 'bundler'
Bundler.setup ENV['RACK_ENV']

require 'sinatra'
require 'haml'
require 'sass'
require 'rdiscount'
require 'sinatra/sequel'
require 'json'

require './database'

configure do
  set :app_file => 'poacher.rb'
  set :haml => {:format => :html5}
  set :sass => {:load_paths => [File.join(Sinatra::Application.public,'sass')]}
end

configure :production do
  ENV['APP_ROOT'] ||= File.dirname(__FILE__)
end
