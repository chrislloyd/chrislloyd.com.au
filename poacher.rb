require 'init'

require 'lib/page'
Page.path = 'pages'

class Object
  def try(method)
    send method if respond_to? method
  end
end

helpers do

  def hidden
    {:style => 'display:none;'}
  end

  def page_path(page)
    "/pages/#{page.slug}"
  end

  def partial(name, locals={})
    haml "_#{name}".to_sym, :layout => false, :locals => locals
  end

  # TODO Implement in Javascript
  def transform_ampersands(html)
    html.gsub(' & '," <span class='amp'>&</span> ")
  end

  def render_page(page)
    haml(transform_ampersands(page.template), :layout => false)
  end

  def page_title
    title = ['The Lincolnshire Poacher by Chris Lloyd']
    title.unshift(@page.title) if request.path != '/' && @page.respond_to?(:title)
    title.join(' &mdash; ')
  end

  def meta_tags
    { :author => 'Chris Lloyd',
      :keywords => %w(chris lloyd ruby javascript programming software development language university uni ui ux rb js).join(', '),
      'MSSmartTagsPreventParsing' => true,
      :robots => 'all',
    }
  end

  def figure(src, opts={})
    partial :figure, :src => "/images/#{src}",
                     :caption => opts[:caption],
                     :alt => (opts[:alt] || opts[:caption]),
                     :type => opts[:type],
                     :link => opts[:link],
                     :link_title => (opts[:link_title] || opts[:alt])
  end

  # Returns a hash so I can filter by name when debugging.
  def artworks
    Dir['art/*.coffee'].inject({}) {|works, file|
      works[File.basename(file,'.*')] = File.read(file)
      works
    }
  end

end


before do
  # Serve up yadis.xrdf to OpenID requests
  if request.path == '/' && !request.accept.grep('application/xrds+xml').empty?
    content_type 'application/xrds+xml'
    halt File.read(File.join(options.public,'yadis.xrdf'))

  # Redirect all other domains to thelincolnshirepoacher.com
  elsif !(request.host =~ /thelincolnshirepoacher.com/)
    redirect "http://thelincolnshirepoacher.com#{request.env['REQUEST_URI']}", 301
  end
end if production?


get '/' do
  @pages = Page.all
  haml :index
end

get '/pages/:slug/?' do |slug|
  if @page = Page[slug]
    etag @page.updated.to_i
    haml(:page)
  else
    pass
  end
end

get '/sitemap.xml' do
  @pages = Page.all
  content_type 'application/xml'
  haml :sitemap, :layout => false
end

%w(screen print).each do |style|
  get "/#{style}.css" do
    content_type :css
    path = "public/sass/#{style}.sass"
    last_modified File.mtime(path)
    sass File.read(path)
  end
end

get '/js/lib.js' do
  content_type 'text/javascript'
  Sprockets::Secretary.new(
    :root => "#{Dir.pwd}/vendor/js",
    :source_files => ['coffee-script/extras/coffee-script.js', 'raphael/raphael.js']
  ).concatenation.to_s
end

post '/tee' do
  content_type :json

  # puts request.body.read
  svg = '<?xml version="1.0" standalone="no"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
    "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'
  svg += request.body.read

  image = Magick::Image.from_blob(svg) do |input|
    input.background_color = 'none'
    input.size = '2400x3200'
    input.depth = 8
  end.first

  # image.alpha Magick::ActivateAlphaChannel
  image        = image.modulate(1.2)
  image.format = 'PNG'
  # 2400, 3200
  # image.resize!(2400,3200)

  File.open('foo.png','w'){|f| f.write image.to_blob}

  return 'foo'.to_json

    now = Time.now
    mech = Mechanize.new

    tee_url = ''

    # Login to RedBubble
  mech.get('http://redbubble.com/auth/login').form_with(:method => 'POST') do |form|
    form.field_with(:name => 'user[user_name]').value = ENV['REDBUBBLE_USER']
    form.field_with(:name => 'user[password]').value = ENV['REDBUBBLE_PASSWORD']
  end.submit

  mech.get('http://redbubble.com/mybubble/clothing/new') do |tee_page|

    # Upload the image
    foo = tee_page.form_with(:method => 'POST', :action => 'http://uploads.redbubble.com/work_images') do |form|
      field = form.file_uploads.first
      field.file_name = 'foo.png'
      field.file_data = image.to_blob
      field.mime_type = 'image/png'
    end.submit.send(:html_body)

    p foo
    p foo.match(/onSuccess\((\d+),\s*(\d+)\)/)

    # Get the background job number and filesize
    remote_work_image_key = $1.to_i
    remote_work_image_file_size = $2.to_i

    # Submit the details of the work
    foo = tee_page.form_with(:method => 'POST', :action => '/mybubble/clothing') do |form|
      form.field_with(:name => 'work[remote_work_image_key]').value = remote_work_image_key
      form.field_with(:name => 'work[remote_work_image_file_size]').value = remote_work_image_file_size

      form.field_with(:name => 'work[title]').value = 'A Trophy'
      form.field_with(:name => 'work[description]').value = <<-EOS
The T-Shirt is a one-off design from the Lincolnshire Poacher. It was generated on the #{now.strftime('%d/%m/%Y')}.

To make your own, or to find out more about how it was created, please go to "http://thelincolnshirepoacher.com":http://thelincolnshirepoacher.com.
EOS
      form.field_with(:name => 'work[tag_field]').value = 'poacher, modernist, geometric, generative, random'

      form.field_with(:name => 'work[markup_percentage]').value = 0
    end.submit
    p foo
    p foo.link_with(:text => 'Show public view')
  end

  content_type :json
  tee_url.to_json
end

get '/tumblr/?' do
  haml :tumblr, :layout => false
end if development?

not_found do
  haml :not_found
end
