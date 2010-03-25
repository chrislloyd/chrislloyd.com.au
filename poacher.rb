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
  # def transform_ampersands(html)
  #   html.gsub(' & '," <span class='amp'>&</span> ")
  # end

  def render_page(page)
    Tilt.new(page.path).render(self)
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

  def coffee(view_name)
    File.read(File.join(settings.views, "#{view_name}.coffee"))
  end

  # Returns a hash so I can filter by name when debugging.
  def artworks
    Dir['art/*.coffee'].
      map{|f| File.basename(f,'.*')}.
      inject({}) {|works, file|
        works[file] = coffee("../art/#{file}")
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

get '/tumblr/?' do
  haml :tumblr, :layout => false
end if development?

not_found do
  haml :not_found
end
