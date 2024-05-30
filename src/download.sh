#!/bin/bash

# Function to perform the curl operation
fetch_page() {
  local page_number=$1
  local url="https://www.allsides.com/media-bias/ratings?page=${page_number}&field_featured_bias_rating_value=All&field_news_source_type_tid%5B1%5D=1&field_news_source_type_tid%5B2%5D=2&field_news_source_type_tid%5B3%5D=3&field_news_source_type_tid%5B4%5D=4"
  local output_file="data/page_${page_number}.html"
  
  # Perform the curl and capture the status code
  status_code=$(curl -s -o "$output_file" -w "%{http_code}" "$url" \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.8' \
  -H 'cookie: source=None+Provided; medium=None+Provided; campaign=None+Provided; region_name=Florida' \
  -H 'dnt: 1' \
  -H 'priority: u=1, i' \
  -H 'referer: https://www.allsides.com/media-bias/ratings?field_featured_bias_rating_value=All&field_news_source_type_tid[1]=1&field_news_source_type_tid[2]=2&field_news_source_type_tid[3]=3&field_news_source_type_tid[4]=4' \
  -H 'sec-ch-ua: "Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-gpc: 1' \
  -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' \
  -H 'x-requested-with: XMLHttpRequest')

  echo "($status_code) Updated page $page_number..."
}

page_number=1

while true; do
  fetch_page $page_number
  
  if grep -q "No Record(s) found." "data/page_${page_number}.html"; then
    echo "Update finished!"
    rm "data/page_${page_number}.html"
    break
  fi

  sleep 2
  page_number=$((page_number + 1))
done
