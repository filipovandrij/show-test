#!/bin/bash

if [[ -n "$1" ]]; then
    base_directory="$1"
else
    base_directory="."
fi

# LIST OF FILENAME EXTENSIONS TO IGNORE. COULD BE ADDED FREELY WITH SYNTAX SPACE+*+.extension
exception_extensions="*.log *.tmp *.bak *.pyc"

# Initialize variables
counter=1
output_filename="file_concat_output"
output_file="${output_filename}_${counter}.md"
# MAXIMUM LENGTH OF A FILE. COULD BE CHANGED FREELY
max_length=32000000
success_message="Success: All files processed and concatenated into $output_file."
exceed_limit_message="Warning: File exceeds the length limit and cannot be added."

# Create an array from the space-separated string of exception extensions
IFS=' ' read -r -a exceptions <<< "$exception_extensions"

# Start find command with collecting all files
find_cmd=(find "$base_directory" -type f -not -path "*/migrations/*")

# Append -not -name for each exception extension to the find command
for ext in "${exceptions[@]}"; do
    find_cmd+=(-not -name "$ext")
done

# Execute the find command
"${find_cmd[@]}" -print0 | while IFS= read -r -d '' file; do
    echo "Processing file: $file"

    # Attempt to read the file content
    if ! file_content=$(<"$file"); then
        echo "Error: Unable to read file - $file"
        continue
    fi

    # Count the characters in the current file
    file_length=${#file_content}

    # Check if file exceeds the maximum length for single file
    if ((file_length > max_length)); then
        echo "$exceed_limit_message - $file"
        continue
    fi

    # Prepare the content with markdown formatting
    markdown_content="\n\n---\n\n##### File: $file\n\n\`\`\`python\n$file_content\n\`\`\`\n"

    # Check the combined length of the markdown_content and the output file
    if (( $(wc -m < "$output_file") + ${#markdown_content} > max_length )); then
        # If it exceeds max_length, increment counter and write to a new file
        ((counter++))
        output_file="${output_filename}_${counter}.md"
    fi

    # Write markdown_content to the output_file
    echo -e "$markdown_content" >> "$output_file"
done

# Print success message
echo -e "\n$success_message\n"