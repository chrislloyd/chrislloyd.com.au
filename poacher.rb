require 'init'

require 'lib/article'
require 'lib/numerals'

Article.path = 'articles'

class Object
  def try(method)
    send method if respond_to? method
  end
end

helpers do

  def hidden
    {:style => 'display:none;'}
  end

  def article_path(article)
    "/articles/#{article.slug}"
  end

  def partial(name, locals={})
    haml "_#{name}".to_sym, :layout => false, :locals => locals
  end

  # TODO Implement in Javascript
  def transform_ampersands(html)
    html.gsub(' & '," <span class='amp'>&</span> ")
  end

  def render_article(article)
    haml(transform_ampersands(article.template), :layout => false)
  end

  def current_article?(article)
    @article == article
  end

  def article_title
    base = 'The Lincolnshire Poacher by Chris Lloyd'
    if request.path == '/'
      base
    else
        [@article.try(:title),base].compact.join(' &mdash; ')
    end
  end

  def meta_tags
    { :author => 'Chris Lloyd',
      :keywords => %w(chris lloyd ruby javascript programming software development language university uni ui ux rb js).join(', '),
      :description => "The Lincolnshire Poacher is a collection of articles written by Chris Lloyd about programming, technology & business. #{@article.try(:extract)}",
      'MSSmartTagsPreventParsing' => true,
      :robots => 'all',
      'google-site-verification' =>  'lrUadsAhZFgSsFpxP8mqYxJhqVgjOwDtW5X3RfPMqLA'
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

end

before do
  if request.path == '/' && !request.accept.grep('application/xrds+xml').empty?
    content_type 'application/xrds+xml'
    halt File.read(File.join(options.public,'yadis.xrdf'))
  elsif !(request.host =~ /thelincolnshirepoacher.com/)
    path = 'http://thelincolnshirepoacher.com' + request.env['REQUEST_URI']
    redirect path, 301
  end
end if production?


get '/' do
  @pages = Article.recent
  haml :index
end

get '/articles/:slug/?' do |slug|
  (@article = Article[slug]) ? haml(:article) : pass
end

# Legacy
get '/post/:tumblr/:slug/?' do |tumblr, slug|
  (@article = Article.find_from_tumblr(tumblr, slug)) ? redirect(article_path(@article), 301) : pass
end

get '/sitemap.xml' do
  @articles = Article.recent
  content_type 'application/xml'
  haml :sitemap, :layout => false
end

%w(screen print).each do |style|
  get "/#{style}.css" do
    content_type :css
    sass File.read("public/sass/#{style}.sass")
  end
end

get '/poacher.js' do
  @artworks = Dir['art/*.coffee'].inject({}) {|works, file|
    works[File.basename(file,'.*')] = File.read(file)
    works
  }
  content_type 'text/javascript'
  CoffeeScript.compile erb(:'art.coffee')
end

not_found do
  haml :not_found
end
