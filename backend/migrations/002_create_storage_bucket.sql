INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images');
