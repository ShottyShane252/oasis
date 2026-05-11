*** Settings ***
Library    Browser
Test Teardown    Close Browser

*** Variables ***
${BASE_URL}    https://daauudi.switzerlandnorth.cloudapp.azure.com
${BMI_URL}     ${BASE_URL}/bmi.html

*** Test Cases ***
User Can Calculate BMI
    New Browser    chromium    headless=No
    New Page    ${BMI_URL}

    Type Text    id=weight    80
    Type Text    id=height    180
    Click        css=button[type="submit"]

    Get Text    css=.bmi-score    contains    24.7
    Get Text    css=.analysis    contains    Normaali

    Sleep    5s
