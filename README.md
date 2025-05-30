# Overview 

## Purpose and Scope
The AI Component Generator is a full-stack web application that enables users to generate, customize, and manage UI components using artificial intelligence. The system provides a freemium SaaS model with subscription-based feature gating, real-time component preview, and code export capabilities.

This document covers the overall system architecture, core technologies, and high-level component interactions. For detailed information about specific subsystems, see Component Generation System, Authentication System, Subscription Management, and API Reference.

## System Architecture Overview

![Screenshot (494)](https://github.com/user-attachments/assets/96ef4dbf-f0e0-4171-a406-346904639d2c)

<br/>

## Technology Stack

| **Layer**           | **Technology**                               | **Purpose**                                      |
|---------------------|-----------------------------------------------|--------------------------------------------------|
| Frontend Framework  | [Next.js 14](https://nextjs.org/)             | App Router, SSR, and React framework             |
| State Management    | [Zustand](https://github.com/pmndrs/zustand)  | Global component state management                |
| Server State        | [React Query](https://tanstack.com/query)     | API data fetching and caching                    |
| API Framework       | [Hono](https://hono.dev/)                     | Lightweight backend API framework                |
| Database/Auth       | [Appwrite](https://appwrite.io/)              | Backend-as-a-Service for data and authentication |
| AI Service          | [Mistral AI](https://docs.mistral.ai/)        | Component code generation                        |
| Code Preview        | [Sandpack](https://sandpack.codesandbox.io/)  | Live component preview and editing               |
| Payment             | [Lemon Squeezy](https://www.lemonsqueezy.com/)| Subscription billing and checkout                |
| UI Components       | [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS](https://tailwindcss.com/) | Design system and styling  |
| Form Handling       | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Form validation and management |
<br/>


## Core Component Generation Flow

![Screenshot (495)](https://github.com/user-attachments/assets/6c6badd1-4235-45ba-810c-4a6fd5cc1479)

<br/>

## Subscription Plan Management

The system implements a **three-tier freemium model** with plan-based feature restrictions:

| **Plan**      | **AI Requests/Month** | **Frameworks**     | **Themes**     | **Components Limit** |
|---------------|------------------------|---------------------|----------------|------------------------|
| Free          | 500                    | React only          | Earthy only    | 10                     |
| Pro           | 1000                   | All frameworks      | All themes     | 50                     |
| Enterprise    | Unlimited              | All frameworks      | All themes     | Unlimited              |

<br/>

## SandpackProvider Configuration
The preview system includes:

- External Resources: Bootstrap CSS, Tailwind CSS browser bundle
- Dependencies: react-icons for icon support
- Custom Setup: Template-specific configuration
- Real-time Updates: recompileMode: "immediate" with autoReload: true
