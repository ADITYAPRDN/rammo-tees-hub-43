
import { useState, useEffect, ChangeEvent } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Search, Edit, Trash2, Image, Save, X, Upload } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';

// Update import to use the reexported Product type
import { 
  fetchProducts, createProduct, updateProduct, deleteProduct, type Product 
} from '@/services/productService';
import { formatCurrency } from '@/lib/utils';

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Form state
  const [formState, setFormState] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    sizes: [] as string[],
    stock: 0
  });
  
  const { toast } = useToast();
  
  // Available sizes
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [products, searchTerm]);
  
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data produk",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormState({
      id: '',
      name: '',
      description: '',
      price: 0,
      image: '',
      sizes: [],
      stock: 0
    });
    setImagePreview(null);
    setImageFile(null);
  };
  
  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormState({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      sizes: product.sizes,
      stock: product.stock || 0
    });
    setImagePreview(product.image);
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      sizes: checked 
        ? [...prev.sizes, size]
        : prev.sizes.filter(s => s !== size)
    }));
  };
  
  const validateForm = () => {
    if (!formState.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Nama produk tidak boleh kosong",
      });
      return false;
    }
    
    if (!formState.description.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Deskripsi produk tidak boleh kosong",
      });
      return false;
    }
    
    if (formState.price <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Harga produk harus lebih dari 0",
      });
      return false;
    }
    
    if (formState.sizes.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Pilih setidaknya satu ukuran",
      });
      return false;
    }
    
    return true;
  };
  
  // Fungsi simulasi upload gambar
  const uploadImage = async (file: File): Promise<string> => {
    // Dalam implementasi nyata, ini akan mengunggah ke server
    // Untuk sekarang, kita gunakan URL.createObjectURL untuk simulasi
    return new Promise((resolve) => {
      setTimeout(() => {
        // Gunakan imagePreview sebagai URL gambar
        resolve(imagePreview || '/placeholder.svg');
      }, 500);
    });
  };
  
  const handleCreateProduct = async () => {
    if (!validateForm()) return;
    
    try {
      // Proses upload gambar jika ada
      let imageUrl = formState.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const newProduct = await createProduct({
        name: formState.name,
        description: formState.description,
        price: formState.price,
        image: imageUrl || '/placeholder.svg',
        sizes: formState.sizes,
        stock: formState.stock
      });
      
      setProducts([...products, newProduct]);
      
      toast({
        title: "Produk Ditambahkan",
        description: "Produk baru berhasil ditambahkan",
      });
      
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan produk",
      });
    }
  };
  
  const handleUpdateProduct = async () => {
    if (!validateForm() || !selectedProduct) return;
    
    try {
      // Proses upload gambar jika ada
      let imageUrl = formState.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      const updatedProduct = await updateProduct(selectedProduct.id, {
        name: formState.name,
        description: formState.description,
        price: formState.price,
        image: imageUrl,
        sizes: formState.sizes,
        stock: formState.stock
      });
      
      if (updatedProduct) {
        setProducts(products.map(product => 
          product.id === selectedProduct.id ? updatedProduct : product
        ));
      }
      
      toast({
        title: "Produk Diperbarui",
        description: "Data produk berhasil diperbarui",
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui produk",
      });
    }
  };
  
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await deleteProduct(selectedProduct.id);
      
      setProducts(products.filter(product => product.id !== selectedProduct.id));
      
      toast({
        title: "Produk Dihapus",
        description: "Produk berhasil dihapus dari sistem",
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus produk",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Cari produk..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={handleOpenAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Produk
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gambar</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Ukuran</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7} className="h-16">
                        <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Tidak ada produk yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-10 w-10 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate">{product.description}</p>
                      </TableCell>
                      <TableCell>{product.sizes.join(', ')}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                      <TableCell className="text-right">{product.stock || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenEditDialog(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenDeleteDialog(product)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Produk Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi produk baru di sini.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama produk"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                placeholder="Masukkan deskripsi produk"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Harga (Rp)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formState.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formState.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Gambar Produk</Label>
              <div className="flex items-center gap-2">
                <Label 
                  htmlFor="image-upload" 
                  className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-2 px-4 w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span>Pilih Gambar</span>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>
              
              {imagePreview && (
                <div className="mt-2 border rounded p-2 flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-red-500" 
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Hapus Gambar
                  </Button>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Alternatif: Masukkan URL gambar
              </p>
              <Input
                id="image"
                name="image"
                value={formState.image}
                onChange={handleInputChange}
                placeholder="Masukkan URL gambar produk"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ukuran yang Tersedia</Label>
              <div className="flex flex-wrap gap-4 mt-1">
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={formState.sizes.includes(size)}
                      onCheckedChange={(checked) => 
                        handleSizeChange(size, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`size-${size}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateProduct}>
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Perbarui informasi produk.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nama Produk</Label>
              <Input
                id="edit-name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Harga (Rp)</Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  min="0"
                  value={formState.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stok</Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formState.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Gambar Produk</Label>
              <div className="flex items-center gap-2">
                <Label 
                  htmlFor="edit-image-upload" 
                  className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-2 px-4 w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span>Ganti Gambar</span>
                  <Input
                    id="edit-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
              </div>
              
              {imagePreview && (
                <div className="mt-2 border rounded p-2 flex flex-col items-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  {imageFile && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-red-500" 
                      onClick={() => {
                        // Kembalikan ke URL gambar asli
                        setImagePreview(formState.image);
                        setImageFile(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Batalkan Perubahan
                    </Button>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Alternatif: Masukkan URL gambar
              </p>
              <Input
                id="edit-image"
                name="image"
                value={formState.image}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Ukuran yang Tersedia</Label>
              <div className="flex flex-wrap gap-4 mt-1">
                {availableSizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-size-${size}`}
                      checked={formState.sizes.includes(size)}
                      onCheckedChange={(checked) => 
                        handleSizeChange(size, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`edit-size-${size}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdateProduct}>
              <Save className="h-4 w-4 mr-2" />
              Perbarui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Produk</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="flex items-center space-x-4 p-4 border rounded-md bg-red-50 border-red-100">
              <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-500">{formatCurrency(selectedProduct.price)}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteProduct}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManagement;
