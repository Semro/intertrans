<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Semro/intertrans.git">
    <img src="images/logo.png" alt="Logo" width="300" height="300">
  </a>

  <h3 align="center">INTERTRANS</h3>

  <p align="center">
    Get your way with us!
  </p>
</p>

<!-- ABOUT THE PROJECT -->

## About the project

«Интермодальные перевозки» в составе бригады «главного программиста» разработать программу (комплекс программ), позволяющий получить множество маршрутов при интермодальных перевозках. Интермодальные – перевозки с использованием различных видов транспорта, в нашем случае пассажирского. Программа должна позволять за приемлемое время находить множество путей из выбранных пунктов А и В

1. Для программы рассмотреть следующие виды транспорта: Самолет, поезд, автобус и машина.
2. В работе рассмотреть около 1000 пунктов и 5000-10000 маршрутов между городами.
3. Следует учитывать расписание, т.е. время прибытия и отправления.
4. Приемлемое время выдачи первого маршрута 30 сек.
5. Рассмотреть пользовательский интерфейс с возможностью выбора пунктов отправления и назначения и визуализации маршрутов.
6. Учитывать различные ограничения: отсутствие прав, не летает на самолетах, на конкретных компаниях, не ездит на поездах
7. Обеспечить сортировку результатов работы, по стоимости, времени и др.
8. Время в пути, отправления и прибытия стараться брать приближенные к реальности.

You can find back-end code here: https://github.com/Tenlern/PathfinderTit

<!-- Usage -->

## Usage

You can the project on Heroku: [https://intertrans.herokuapp.com/](https://intertrans.herokuapp.com/)
<br />
Example inputs:
<br />

- Откуда: Москва, Минск, Рига, Санкт-Петербург
  <br />
- Куда: Москва, Минск, Рига, Санкт-Петербург
  <br />
- Когда: 18.10.2018

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

1. Clone the repo

```sh
git clone https://github.com/Semro/intertrans.git
```

2. Install NPM packages

```sh
npm install
```

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`][license-url] for more information.

<!-- CONTACT -->

## Contact

Semro - semro@outlook.com

Project Link: [https://github.com/Semro/intertrans](https://github.com/Semro/intertrans)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/semro/intertrans.svg?style=flat-square
[contributors-url]: https://github.com/semro/intertrans/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/semro/intertrans.svg?style=flat-square
[forks-url]: https://github.com/semro/intertrans/network/members
[stars-shield]: https://img.shields.io/github/stars/semro/intertrans.svg?style=flat-square
[stars-url]: stargazers
[issues-shield]: https://img.shields.io/github/issues/semro/intertrans.svg?style=flat-square
[issues-url]: https://github.com/semro/intertrans/issues
[license-shield]: https://img.shields.io/github/license/semro/intertrans.svg?style=flat-square
[license-url]: https://github.com/Semro/intertrans/blob/master/LICENSE.md
