migration 'create the hearts table' do
  database.create_table :hearts do
    primary_key :id
    String      :path
    String      :src, :text => true
    DateTime    :created_at, :null => false
    index       :path
  end
end
