# Oasis-sovelluksen testaus

## Testauksen tavoite

Testauksen tavoitteena oli varmistaa, että Oasis-sovelluksen keskeiset käyttötapaukset toimivat oikein. Testit toteutettiin Robot Frameworkilla ja Browser Librarylla.

## Testien tiedostorakenne

```text
tests/
├── front/
│   ├── login.robot
│   ├── bmi.robot
│   ├── home.robot
│   ├── diary.robot
│   ├── kubios.robot
│   └── psqi.robot
├── resources/
│   └── load_env.py
└── outputs/
    ├── login/
    ├── bmi/
    ├── home/
    ├── diary/
    ├── kubios/
    └── psqi/
```

## Toteutetut testit

- **login.robot**: Testaa kirjautumisen onnistumisen ja epäonnistumisen eri skenaarioissa.
- **bmi.robot**: Testaa BMI-laskurin toimivuuden ja oikeellisuuden.
- **home.robot**: Testaa kotisivun elementtien näkyvyyden ja toimivuuden.
- **diary.robot**: Testaa päiväkirjamerkinnän luomisen, tallentamisen ja poistamisen.
- **kubios.robot**: Testaa Kubios HRV -mittausdatan visualisoinnin.
- **psqi.robot**: Testaa PSQI-unikyselyn täyttämisen ja tallentamisen.



## Havainnot

Testien avulla varmistettiin, että sovelluksen tärkeimmät käyttötapaukset toimivat selaimessa. Testeissä käytettiin kirjautumiseen .env-tiedostoon tallennettuja testitunnuksia, jotta käyttäjätunnuksia ja salasanoja ei tarvitse kirjoittaa suoraan testitiedostoihin.

Testien raportit ja lokit tallennetaan erillisiin tests/outputs/-kansioihin, jotta jokaisen testikokonaisuuden tulokset pysyvät selkeästi erillään.

## Tekoälyn hyödyntäminen testauksessa

Testien suunnittelussa, Robot Framework -syntaksin korjaamisessa ja dokumentaation muotoilussa on hyödynnetty tekoälyä. Lopulliset testit on kuitenkin ajettu ja tarkistettu projektiryhmän toimesta.

## Testien ajaminen

Yksittäiset testit voidaan ajaa seuraavilla komennoilla:

```bash
robot -d tests/outputs/login tests/front/login.robot
robot -d tests/outputs/bmi tests/front/bmi.robot
robot -d tests/outputs/home tests/front/home.robot
robot -d tests/outputs/diary tests/front/diary.robot
robot -d tests/outputs/kubios tests/front/kubios.robot
robot -d tests/outputs/psqi tests/front/psqi.robot
```

