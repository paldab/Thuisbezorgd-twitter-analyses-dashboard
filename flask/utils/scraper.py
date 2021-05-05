from selenium import webdriver
import time
from .progressbar import printProgressBar

def scrape_reviews():
    return 69;

if __name__ == '__main__':
    scraped_reviews = []

    browser = webdriver.Chrome() # options=chrome_options
    browser.get("https://nl.trustpilot.com/review/thuisbezorgd.nl")

    # remove disgusting accept cookies banner
    remove_consent_banner_js = "let el = document.getElementById(\"onetrust-consent-sdk\");el.remove();"
    time.sleep(1)
    browser.execute_script(remove_consent_banner_js)

    # scrape basic information
    title = browser.find_elements_by_css_selector("h1.multi-size-header span")[0].text
    total_reviews = browser.find_element_by_class_name("headline__review-count").text
    print("\n{title}".format(title=title))
    print("URL: {url}".format(url=browser.current_url))
    print("Total amount of reviews: {total_reviews}".format(total_reviews=total_reviews))
 
    # When you need to scroll to bottom.
    # time.sleep(0.4)
    # button = browser.find_elements_by_css_selector("nav.pagination-container a.button.next-page")[0]
    # browser.execute_script("arguments[0].scrollIntoView({block: \"end\", inline: \"nearest\"});", button)



    # steps
    # 1. scrape current visible reviews
    # 2. scroll next button into view and click on it

    # while button exists in DOM, then click on it and scrape current reviews

    time.sleep(1500)

    browser.quit()