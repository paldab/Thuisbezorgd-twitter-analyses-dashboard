from selenium import webdriver
from selenium.webdriver.common.by import By
import selenium.webdriver.support.expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
import time
from pathlib import Path
import pandas as pd
from progressbar import printProgressBar

def backup():
    hotel_reviews_df = pd.DataFrame(data=scraped_reviews, columns=['review', 'rating'])

    csv_path = (Path(__file__).parent.parent / "datasets/reviews.csv").resolve()

    hotel_reviews_df.to_csv(csv_path, index=False)

    print("\nCreated csv file in datasets folder.")

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
    total_reviews = browser.find_element_by_class_name("headline__review-count").text.replace(".", "")
    print("\n{title}".format(title=title))
    print("URL: {url}".format(url=browser.current_url))
    print("Total amount of reviews: {total_reviews}".format(total_reviews=total_reviews))
    printProgressBar(0, int(total_reviews), prefix = 'Progress:', suffix = 'Complete', length = 50)


    button = browser.find_elements_by_css_selector("nav.pagination-container a.button.next-page")
    i = 0
    try:
        while len(button) != 0:
            time.sleep(2)
            WebDriverWait(browser, 100).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.review-list")))
            total_reviews = browser.find_element_by_class_name("headline__review-count").text.replace(".", "")

            review_list = browser.find_elements_by_css_selector("div.review-list div.review-card article.review")

            for review in review_list:
                time.sleep(0.4)
                rev_content = review.find_elements_by_css_selector("section div.review-content div.review-content__body p.review-content__text")
                rev_rating = review.find_elements_by_css_selector("section div.review-content div.review-content__header div.star-rating img")[0].get_attribute('alt')
                # check if review has a description, if not move on.
                if len(rev_content) == 0:
                    continue;
                
                rev_content = rev_content[0].text.replace('\n', '')
                rev_rating = rev_rating.split(' ')[0]

                scraped_reviews.append([
                    rev_content, rev_rating
                ])

            time.sleep(0.4)
            button = browser.find_elements_by_css_selector("nav.pagination-container a.button.next-page")

            if len(button) != 0:
                browser.execute_script("arguments[0].scrollIntoView({block: \"end\", inline: \"nearest\"});", button[0])
                button[0].click()

            i += 20
            printProgressBar(i, int(total_reviews), prefix = 'Progress:', suffix = 'Complete', length = 50)
        
        browser.quit()
        backup()

    except Exception as e:
        backup()
        pass
    
    # filter emojis from dataframe
    # df.astype(str).apply(lambda x: x.str.encode('ascii', 'ignore').str.decode('ascii'))