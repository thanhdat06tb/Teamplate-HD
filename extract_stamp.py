from PIL import Image
import numpy as np

def extract_red_stamp(input_path, output_path):
    print("Loading image:", input_path)
    img = Image.open(input_path).convert("RGBA")
    
    # Convert image to numpy array
    data = np.array(img)
    
    # data is a 3D array: [height, width, 4] for R, G, B, A
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # We want to isolate pixels that are "red" and exclude blue/black/white. 
    # Red is where R dominates strongly over G and B.
    # We also check that the pixel isn't simply white (where R, G, B are all high)
    
    # A simple red condition:
    # R > 150 (must be fairly red)
    # G < 150 (not white/yellow)
    # B < 150 (not magenta/white)
    # Or R > G + 50 and R > B + 50
    is_red = (r > 100) & (g < 150) & (b < 150) & (r > g + 40) & (r > b + 40)
    
    # For a stamp which can be a bit translucent, we can relax it:
    is_red_relaxed = (r.astype(int) - g.astype(int) > 30) & (r.astype(int) - b.astype(int) > 30) & (r > 90)
    
    # We make all non-red pixels fully transparent
    # And we make red pixels fully opaque (or keep their original red)
    # To improve quality, we can just set alpha=0 for non-red.
    
    data[:,:,3] = np.where(is_red_relaxed, 255, 0)
    
    # Note: blue text typically has B > R, and black has R,G,B all low (e.g. < 80)
    # So our is_red_relaxed reliably ignores them.
    
    out_img = Image.fromarray(data)
    out_img.save(output_path)
    print("Saved extracted stamp to:", output_path)

if __name__ == "__main__":
    extract_red_stamp("Picture2.png", "stamp_cleaned.png")
