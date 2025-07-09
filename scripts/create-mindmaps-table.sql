-- Create mind_maps table
CREATE TABLE IF NOT EXISTS mind_maps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  nodes JSONB DEFAULT '[]'::jsonb,
  edges JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mind_maps_user_id ON mind_maps(user_id);
CREATE INDEX IF NOT EXISTS idx_mind_maps_created_at ON mind_maps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mind_maps_updated_at ON mind_maps(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE mind_maps ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own mind maps
CREATE POLICY "Users can view their own mind maps" ON mind_maps
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own mind maps
CREATE POLICY "Users can insert their own mind maps" ON mind_maps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own mind maps
CREATE POLICY "Users can update their own mind maps" ON mind_maps
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own mind maps
CREATE POLICY "Users can delete their own mind maps" ON mind_maps
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_mind_maps_updated_at 
  BEFORE UPDATE ON mind_maps 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing (optional)
-- INSERT INTO mind_maps (title, description, nodes, edges, user_id) VALUES
--   ('Sample Project Plan', 'A sample project management mind map', 
--    '[{"id": "1", "label": "Project Management", "x": 400, "y": 300}]'::jsonb,
--    '[]'::jsonb,
--    (SELECT id FROM auth.users LIMIT 1)); 