class Heart < Sequel::Model

  def before_create
    self.created_at = Time.now
  end

end
