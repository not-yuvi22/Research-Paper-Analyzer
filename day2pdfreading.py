import fitz

pdf = fitz.open("SRN_new.pdf")

text = ""

for page in pdf:
    text += page.get_text()

# Save extracted text to a file
with open("paper_text.txt", "w", encoding="utf-8") as f:
    f.write(text)
print("Characters:", len(text))
print("\nFirst 2000 characters:\n")
print(text[:2000]) 