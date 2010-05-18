migration 'create the hearts table' do
  database.create_table :hearts do
    primary_key :id
    string      :path
    text        :src
    timestamp   :created_at, :null => false
    index       :path
  end
end
