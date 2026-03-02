---
title: "About the Quantum Routing Zoo"
tags:
  - 'allPages'
---

# About this project

The Quantum Routing Zoo is a structured database and catalog of quantum routing algorithms, transpilation heuristics, and hardware-specific compilation strategies. 

As quantum hardware scales in the NISQ era and beyond, efficient routing—mapping logical circuits to physical qubits while minimizing depth and error—has become a critical area of research. This site organizes these diverse algorithms by their underlying paradigms, computational complexities, and historical relationships to one another (such as which algorithms serve as baselines or improvements for others).

This project was created and is maintained by M. Elijah W., Yashar Khan, and Dr. Sonia Lopez-Alarcon.

# How it works

The underlying database is built using the open-source [ZooDb framework](https://github.com/phfaist/zoodb), which generates this site from a collection of easily readable, structured YAML files. The frontend is powered by the [Eleventy static site generator](https://11ty.dev/) and the [Parcel bundler](https://parceljs.org/).

Because the data is entirely separated from the rendering logic, the database is highly extensible. You can easily contribute or play around with the data by editing or adding new YAML files in the `data/nodes` folder of the repository.

# More information

To learn more about the database framework powering this site, check out the [ZooDb GitHub repository](https://github.com/phfaist/zoodb/).
