class Page

  attr_accessor :path, :template

  def self.path=(path)
    @path = path
  end

  def self.files
    Dir["#{File.expand_path(@path)}/*.haml"]
  end

  def self.all
    @all ||= files.collect {|f| new(f, File.read(f)) }.sort_by{|a| a.slug}
  end

  def self.find_from_tumblr(tumblr, slug)
    all.find {|a| a.slug == slug && a.tumblr == tumblr }
  end

  def self.[](slug)
    all.find {|p| p.slug == slug }
  end

  def initialize(path, contents)
    @path, @template = path, contents
  end

  def id
    slug
  end

  def slug
    File.basename(self.path, '.*')
  end

  def updated
    File.mtime(path)
  end

  [:title, :tumblr].each do |attr|
    define_method(attr) { slot(attr) }
  end

# private

  def self.date_regexp
    /(\d+)-(\d+)-(\d+)\s(\d+):(\d+)/
  end

  def self.comment_regexp
    /\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/
  end

  def slot(name)
    template[/^-#\s+#{name}:\s*(.*)$/, 1].try(:strip)
  end

end
