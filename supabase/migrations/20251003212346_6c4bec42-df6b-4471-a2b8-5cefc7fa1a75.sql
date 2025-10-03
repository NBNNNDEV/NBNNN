-- Create a table to store global click count
CREATE TABLE public.global_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert initial row with count 0
INSERT INTO public.global_clicks (count) VALUES (0);

-- Enable Row Level Security
ALTER TABLE public.global_clicks ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read the click count
CREATE POLICY "Anyone can view click count"
ON public.global_clicks
FOR SELECT
TO public
USING (true);

-- Allow everyone to update the click count
CREATE POLICY "Anyone can update click count"
ON public.global_clicks
FOR UPDATE
TO public
USING (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_clicks;