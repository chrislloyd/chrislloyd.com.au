require 'init'

require 'lib/article'

Article.path = 'articles'

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
end

get '/' do
  @articles = Article.recent
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

get /^\/css\/(.+)\.css/ do |style_file|
  sass_file = File.join('public','sass',"#{style_file}.sass")
  pass unless File.exist?(sass_file)
  content_type :css
  sass File.read(sass_file)
end




{ '/rss' => 'http://feeds.feedburner.com/thelincolnshirepoacher'
}.each {|from,to| get(from){ redirect(to,301) } }
