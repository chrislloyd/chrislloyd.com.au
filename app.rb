require 'init'

require 'lib/article'

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
  def absoluteify_links(html)
    html.
      gsub(/href=(["'])(\/.*?)(["'])/, 'href=\1http://thelincolnshirepoacher.com\2\3').
      gsub(/src=(["'])(\/.*?)(["'])/, 'src=\1http://thelincolnshirepoacher.com\2\3')
  end
  def strip_tags(html)
    html.gsub(/<\/?[^>]*>/, '')
  end
  def render_article(article)
    haml(article.template, :layout => false)
  end
  def current_article?(article)
    @article == article
  end
  def article_title
    [@article.try(:title),"The Lincolnshire Poacher"].reject{|t|t.nil?}.join(' &mdash; ')
  end
  def meta_tags
    {
      :author => 'Chris Lloyd',
      :keywords => %w(chris lloyd ruby javascript programming software development language university uni ui ux rb js).join(', '),
      :description => 'An ongoing collection of articles by Chris Lloyd.',
    }
  end
end

get '/' do
  @article = Article.recent.first
  haml :index
end

get '/articles/:slug' do |slug|
  @article = Article[slug]
  haml :article
end

get '/post/:tumblr/:slug' do |tumblr, slug|
  if @article = Article.find_from_tumblr(tumblr, slug)
    redirect(article_path(@article), 301)
  else
    pass
  end
end

get '/feed.atom' do
  @articles = Article.recent
  content_type 'application/atom+xml'
  haml :feed, :layout => false
end

get '/sitemap.xml' do
  @articles = Article.recent
  # content_type 'application/xml'
  haml :sitemap, :layout => false
end

get /^\/css\/(.+)\.css/ do |style_file|
  sass_file = File.join('public','sass',"#{style_file}.sass")
  pass unless File.exist?(sass_file)
  content_type :css
  sass File.read(sass_file)
end


{ '/rss' => 'http://feeds.feedburner.com/thelincolnshirepoacher'
}.each {|from,to| get(from){ redirect(to,301) } }
