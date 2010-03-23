task :dev do
  exec 'bundle exec shotgun --require init --server thin --host 127.0.0.1 --port 4567 poacher.rb'
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
  system "#{ENV['EDITOR']} #{filename}"
end
