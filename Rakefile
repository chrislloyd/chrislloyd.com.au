task :default do
  exec 'ruby app.rb'
end

task :dev do
  exec 'shotgun -s thin -o 0.0.0.0 -p 4567 app.rb'
end
