task :default do
  exec 'shotgun --require init --server thin --host 0.0.0.0 --port 4567 app.rb'
end

task :article do
  print 'Name: '
  name = STDIN.gets.chomp

  filename = "articles/#{name.downcase.gsub(' ','-')}.haml"
  File.open(filename, 'w') do |f|
    f.puts <<-EOF
-# title: #{name}
-# published: #{Time.now.strftime("%Y-%m-%d %H:%M")}
    EOF
  end
end
