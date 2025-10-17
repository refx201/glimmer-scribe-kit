import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Check, X, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBrands } from "@/hooks/useBrands";
import { supabase } from "@/lib/supabase";
import * as ExcelJS from "exceljs";

interface ParsedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  additionalImage?: string;
  brand_id?: string;
  brand_name?: string;
  type: "device" | "accessory";
  errors: string[];
  edited?: boolean;
}

interface BulkProductImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const BulkProductImport = ({ open, onOpenChange, onSuccess }: BulkProductImportProps) => {
  const [step, setStep] = useState<"upload" | "configure" | "import">("upload");
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [workbookData, setWorkbookData] = useState<any>(null);
  
  const [importResults, setImportResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });
  const { toast } = useToast();
  const { brands } = useBrands();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);
      
      const sheetNames = workbook.worksheets.map(sheet => sheet.name);
      setAvailableSheets(sheetNames);
      setSelectedSheet(sheetNames[0]);
      setWorkbookData(workbook);
      
      toast({
        title: "File Uploaded Successfully",
        description: `Found ${sheetNames.length} sheet(s). Please select a sheet to continue.`
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to read the file. Please check the format.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const parseSelectedSheet = useCallback(async () => {
    if (!workbookData || !selectedSheet) return;

    console.log("=== STARTING EXCEL PARSING ===");
    console.log("Workbook data:", !!workbookData);
    console.log("Selected sheet:", selectedSheet);

    try {
      const worksheet = workbookData.getWorksheet(selectedSheet);
      if (!worksheet) {
        console.log("ERROR: Could not get worksheet");
        return;
      }

      console.log("Worksheet found:", !!worksheet);
      console.log("Worksheet has getImages function:", typeof worksheet.getImages);

      const products: ParsedProduct[] = [];
      const extractedImages: { [key: string]: string } = {};

      // Extract all images from the worksheet
      console.log("=== STARTING IMAGE EXTRACTION ===");
      if (worksheet.getImages) {
        const images = worksheet.getImages();
        console.log(`Found ${images.length} images in worksheet`);
        
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          console.log(`Processing image ${i + 1}/${images.length}`);
          console.log("Image object:", img);
          try {
            const imageId = img.imageId;
            console.log("Image ID:", imageId);
            const image = workbookData.getImage(imageId);
            console.log("Image data:", !!image, image ? "has buffer:" + !!image.buffer : "no image");
            
            if (image && image.buffer) {
              // Convert ArrayBuffer/Uint8Array to base64 using browser-compatible method
              const extension = image.extension || 'png';
              const mimeType = `image/${extension}`;
              
              // Convert buffer to Uint8Array if it isn't already
              const uint8Array = new Uint8Array(image.buffer);
              
              // Convert to base64 using browser's btoa function
              let binary = '';
              uint8Array.forEach(byte => {
                binary += String.fromCharCode(byte);
              });
              const base64 = btoa(binary);
              const dataUrl = `data:${mimeType};base64,${base64}`;
              
              // Map to cell range
              const range = img.range;
              const key = `${range.tl.row}_${range.tl.col}`;
              extractedImages[key] = dataUrl;
              console.log(`Extracted image for cell row=${range.tl.row}, col=${range.tl.col}, key="${key}"`);
              console.log(`Image range: top-left(${range.tl.row},${range.tl.col}) to bottom-right(${range.br.row},${range.br.col})`);
            }
          } catch (error) {
            console.error('Error processing image:', error);
          }
        }
      } else {
        console.log("No getImages function available on worksheet");
      }

      console.log(`=== IMAGE EXTRACTION COMPLETE ===`);
      console.log(`Total images extracted: ${Object.keys(extractedImages).length}`);

      // Process rows starting from row 2 (skip header)
      let rowIndex = 2;
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber < 2) return; // Skip header row

        const name = row.getCell(1).text?.trim();
        const priceValue = row.getCell(4).value;
        const priceStr = priceValue?.toString().replace(/[^\d.]/g, "");
        const price = parseFloat(priceStr || "0");

        if (!name) return; // Skip empty rows

        const errors: string[] = [];
        
        // Look for images in columns B (2) and C (3) - ExcelJS uses 1-based indexing
        const mainImageKey = `${rowNumber}_2`; // Column B
        const additionalImageKey = `${rowNumber}_3`; // Column C
        
        const mainImage = extractedImages[mainImageKey] || "";
        const additionalImage = extractedImages[additionalImageKey] || "";

        console.log(`Row ${rowNumber}: Name="${name}"`);
        console.log(`  Looking for main image with key: "${mainImageKey}"`);
        console.log(`  Looking for additional image with key: "${additionalImageKey}"`);
        console.log(`  Found main image: ${!!mainImage}`);
        console.log(`  Found additional image: ${!!additionalImage}`);

        if (!name) errors.push("Product name is required");
        if (!priceStr || isNaN(price)) errors.push("Valid price is required");

        products.push({
          id: `temp-${rowIndex}`,
          name: name || "",
          price: price || 0,
          image: mainImage,
          additionalImage: additionalImage,
          type: "accessory" as const,
          errors
        });

        rowIndex++;
      });

      console.log(`Processed ${products.length} products`);
      console.log(`Products with images: ${products.filter(p => p.image).length}`);
      console.log(`All available image keys:`, Object.keys(extractedImages));
      console.log(`Looking for keys like: 2_2, 3_2, 4_2, etc. for main images`);
      console.log(`Looking for keys like: 2_3, 3_3, 4_3, etc. for additional images`);

      setParsedProducts(products);
      setStep("configure");
      
      const productsWithImages = products.filter(p => p.image).length;
      toast({
        title: "Sheet Parsed Successfully",
        description: `Found ${products.length} products in ${selectedSheet}. ${Object.keys(extractedImages).length} images extracted, ${productsWithImages} products have images.`
      });
    } catch (error) {
      console.error('Parse error:', error);
      toast({
        title: "Parse Error",
        description: "Failed to parse the selected sheet. Please check the format.",
        variant: "destructive"
      });
    }
  }, [workbookData, selectedSheet, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"]
    },
    maxFiles: 1
  });

  const updateProduct = (id: string, field: keyof ParsedProduct, value: any) => {
    setParsedProducts(prev => prev.map(product => 
      product.id === id 
        ? { ...product, [field]: value, edited: true }
        : product
    ));
  };

  const setBrandForProduct = (productId: string, brandName: string) => {
    const brand = brands?.find(b => b.name === brandName);
    setParsedProducts(prev => prev.map(product => 
      product.id === productId 
        ? { 
            ...product, 
            brand_id: brand?.id, 
            brand_name: brandName,
            type: brand?.type === "both" ? "accessory" : (brand?.type as "device" | "accessory") || "accessory"
          }
        : product
    ));
  };

  const setAllBrands = (brandName: string) => {
    const brand = brands?.find(b => b.name === brandName);
    setParsedProducts(prev => prev.map(product => ({
      ...product,
      brand_id: brand?.id,
      brand_name: brandName,
      type: brand?.type === "both" ? "accessory" : (brand?.type as "device" | "accessory") || "accessory"
    })));
    toast({
      title: "Brands Set",
      description: `Set ${brandName} as brand for all ${parsedProducts.length} products.`
    });
  };

  const handleImport = async () => {
    const validProducts = parsedProducts.filter(p => p.errors.length === 0 && p.brand_id);
    
    if (validProducts.length === 0) {
      toast({
        title: "No Valid Products",
        description: "Please fix all errors and assign brands before importing.",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    setStep("import");
    setImportProgress(0);

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < validProducts.length; i++) {
      const product = validProducts[i];
      
      try {
        const additionalPhotos = product.additionalImage ? [product.additionalImage] : [];
        
        // Insert the product first
        const { data: insertedProduct, error } = await supabase
          .from("products")
          .insert({
            name: product.name,
            image: product.image,
            original_price: Math.round(product.price),
            sale_price: Math.round(product.price),
            discount: 0,
            type: product.type,
            brand_id: product.brand_id,
            specifications: { description: "" },
            colors: [],
            additional_photos: []
          })
          .select()
          .single();

        if (error) {
          failedCount++;
          errors.push(`${product.name}: ${error.message}`);
          continue;
        }

        // Now insert additional photos into product_photos table
        if (product.additionalImage && insertedProduct) {
          const { error: photoError } = await supabase
            .from("product_photos")
            .insert({
              product_id: insertedProduct.id,
              photo_url: product.additionalImage
            });

          if (photoError) {
            console.error(`Error adding photo for ${product.name}:`, photoError);
          }
        }

        successCount++;
      } catch (error: any) {
        failedCount++;
        errors.push(`${product.name}: ${error.message}`);
      }

      setImportProgress(((i + 1) / validProducts.length) * 100);
    }

    setImportResults({ success: successCount, failed: failedCount, errors });
    setImporting(false);

    if (successCount > 0) {
      toast({
        title: "Import Completed",
        description: `Successfully imported ${successCount} products${failedCount > 0 ? `, ${failedCount} failed` : ""}.`
      });
      onSuccess();
    }
  };

  const resetDialog = () => {
    setStep("upload");
    setParsedProducts([]);
    setImportProgress(0);
    setImporting(false);
    setImportResults({ success: 0, failed: 0, errors: [] });
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetDialog, 200);
  };

  const configuredProducts = parsedProducts.filter(p => p.brand_id).length;
  const totalProducts = parsedProducts.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Product Import</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className={step === "upload" ? "text-primary font-medium" : ""}>
              1. Upload File
            </span>
            <span className={step === "configure" ? "text-primary font-medium" : ""}>
              2. Configure Products ({configuredProducts}/{totalProducts})
            </span>
            <span className={step === "import" ? "text-primary font-medium" : ""}>
              3. Import
            </span>
          </div>

          {/* Upload Step */}
          {step === "upload" && (
            <div className="space-y-4">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? "Drop the file here" : "Upload Excel or CSV file"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expected format: Column A = Product Name, Column D = Price. You can add photo links after importing.
                </p>
              </div>

              {/* Sheet Selection */}
              {availableSheets.length > 0 && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-medium">Select Sheet to Import</h3>
                  <div className="flex items-center gap-4">
                    <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select a sheet" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSheets.map((sheet) => (
                          <SelectItem key={sheet} value={sheet}>
                            {sheet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={parseSelectedSheet} disabled={!selectedSheet}>
                      <FileText className="h-4 w-4 mr-2" />
                      Parse Sheet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Configure Step */}
          {step === "configure" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Configure brands and validate product data before importing
                </p>
                <Button
                  onClick={handleImport}
                  disabled={configuredProducts === 0}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Import {configuredProducts} Products
                </Button>
              </div>

              {/* Bulk Brand Assignment */}
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-3">Bulk Actions</h3>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Set brand for all products:</span>
                  <Select onValueChange={setAllBrands}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Choose brand for all" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands?.map((brand) => (
                        <SelectItem key={brand.id} value={brand.name}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader>
                     <TableRow>
                       <TableHead className="w-20">Image</TableHead>
                       <TableHead>Product Name</TableHead>
                       <TableHead className="w-48">Photo URL</TableHead>
                       <TableHead className="w-24">Price</TableHead>
                       <TableHead className="w-40">Brand</TableHead>
                       <TableHead className="w-32">Type</TableHead>
                       <TableHead className="w-32">Status</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedProducts.map((product) => (
                      <TableRow key={product.id} className={product.errors.length > 0 ? "bg-red-50" : ""}>
                        <TableCell>
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded border"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">No img</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                            className="w-full"
                          />
                         </TableCell>
                         <TableCell>
                           <Input
                             type="url"
                             placeholder="https://example.com/image.jpg"
                             value={product.image}
                             onChange={(e) => updateProduct(product.id, "image", e.target.value)}
                             className="w-full"
                           />
                         </TableCell>
                         <TableCell>
                           <Input
                             type="number"
                             value={product.price}
                             onChange={(e) => updateProduct(product.id, "price", parseFloat(e.target.value))}
                             className="w-20"
                           />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={product.brand_name || ""}
                            onValueChange={(value) => setBrandForProduct(product.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands?.map((brand) => (
                                <SelectItem key={brand.id} value={brand.name}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={product.type}
                            onValueChange={(value) => updateProduct(product.id, "type", value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="device">Device</SelectItem>
                              <SelectItem value="accessory">Accessory</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {product.errors.length > 0 ? (
                            <div className="flex items-center gap-2 text-red-600">
                              <X className="h-4 w-4" />
                              <span className="text-xs">{product.errors[0]}</span>
                            </div>
                          ) : product.brand_id ? (
                            <div className="flex items-center gap-2 text-green-600">
                              <Check className="h-4 w-4" />
                              <span className="text-xs">Ready</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-yellow-600">
                              <Edit2 className="h-4 w-4" />
                              <span className="text-xs">Need brand</span>
                            </div>
                          )}
                         </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Import Step */}
          {step === "import" && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  {importing ? "Importing Products..." : "Import Complete"}
                </h3>
                <Progress value={importProgress} className="w-full mb-4" />
                <p className="text-sm text-muted-foreground">
                  {importing ? `${Math.round(importProgress)}% complete` : 
                    `${importResults.success} successful, ${importResults.failed} failed`}
                </p>
              </div>

              {importResults.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Import Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {importResults.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!importing && (
                <div className="flex justify-center">
                  <Button onClick={handleClose}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkProductImport;