# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OpenSpiir is a community effort to recreate [Spiir](https://spiir.dk) — a Scandinavian personal finance app — before Spiir shuts down on June 6th, 2026. The goal is feature parity: bank account aggregation, transaction categorization, budgeting, and savings goals.

## Monorepo Structure

```
backend/   # Kotlin + MySQL API server
web/       # React + Tailwind web app
app/       # React Native + Expo mobile app
```

The three packages are independent — each has its own build tooling and dependency management. There is no shared package or workspace root tooling yet.

## Stack Decisions (still being finalized)

- **Backend**: Kotlin (likely Spring Boot or Ktor) with PostgreSQL
- **Web**: React with Tailwind CSS
- **App**: React Native with Expo

Stack choices marked with `?` in the READMEs are not yet locked in. When adding dependencies or scaffolding, prefer the lightest approach that can be changed later.

## Development Commands

> Commands will be added here as each sub-project is scaffolded. Check each subdirectory's README for the latest instructions.

## Contribution Context

This is an open, fast-moving project with a hard deadline. Prioritize getting working features shipped over perfect abstractions. When in doubt, keep things simple and easy for new contributors to understand.
