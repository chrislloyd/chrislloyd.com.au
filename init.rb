ENV['RACK_ENV'] ||= 'development'

require 'rubygems'
require 'bundler'
Bundler.setup :default, ENV['RACK_ENV'].to_sym
Bundler.require :default, ENV['RACK_ENV'].to_sym

require './database'

configure do
  # Hack until Sinatra 1.1
  Encoding.default_external = 'UTF-8' if String.new.respond_to?(:encoding)

  set :app_file => 'poacher.rb'
  set :haml => {:format => :html5, :encoding => 'utf-8'}
  set :sass => {:load_paths => [File.join(Sinatra::Application.public,'sass')]}
  set :rdiscount => {:smart => true}
end

configure :production do
  ENV['APP_ROOT'] ||= File.dirname(__FILE__)
end
