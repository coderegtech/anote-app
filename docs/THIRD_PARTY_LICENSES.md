# Third-Party Licenses

This document lists all third-party dependencies used in AnonNote and their respective licenses.

---

## Production Dependencies

### Core Framework

#### Next.js (MIT)
- **Package**: `next@16.0.0`
- **License**: MIT License
- **Repository**: https://github.com/vercel/next.js
- **Description**: React framework for production

#### React (MIT)
- **Package**: `react@19.2.0`, `react-dom@19.2.0`
- **License**: MIT License
- **Repository**: https://github.com/facebook/react
- **Description**: JavaScript library for building user interfaces

---

### Firebase (Apache 2.0)

#### Firebase
- **Package**: `firebase@12.5.0`
- **License**: Apache License 2.0
- **Repository**: https://github.com/firebase/firebase-js-sdk
- **Description**: Firebase JavaScript SDK
- **Components Used**:
  - Firebase Authentication
  - Cloud Firestore
  - Firebase Storage

**Apache 2.0 License Summary**:
- Commercial use allowed
- Modification allowed
- Distribution allowed
- Patent use allowed
- Private use allowed
- Must include copyright notice
- Must include license text
- Changes must be stated

---

### UI Components (MIT)

#### Radix UI
- **Packages**: Multiple `@radix-ui/react-*` components
- **License**: MIT License
- **Repository**: https://github.com/radix-ui/primitives
- **Description**: Unstyled, accessible UI components
- **Components Used**:
  - Dialog
  - Avatar
  - Scroll Area
  - Toast
  - Tabs
  - And more...

#### Lucide React (ISC)
- **Package**: `lucide-react@0.454.0`
- **License**: ISC License
- **Repository**: https://github.com/lucide-icons/lucide
- **Description**: Icon library

---

### Styling (MIT)

#### Tailwind CSS
- **Package**: `tailwindcss@4.1.9`
- **License**: MIT License
- **Repository**: https://github.com/tailwindlabs/tailwindcss
- **Description**: Utility-first CSS framework

#### tailwind-merge (MIT)
- **Package**: `tailwind-merge@2.5.5`
- **License**: MIT License
- **Repository**: https://github.com/dcastil/tailwind-merge
- **Description**: Merge Tailwind CSS classes

#### class-variance-authority (Apache 2.0)
- **Package**: `class-variance-authority@0.7.1`
- **License**: Apache License 2.0
- **Repository**: https://github.com/joe-bell/cva
- **Description**: Variant-based component styling

---

### Utilities (MIT)

#### clsx (MIT)
- **Package**: `clsx@2.1.1`
- **License**: MIT License
- **Repository**: https://github.com/lukeed/clsx
- **Description**: Tiny utility for constructing className strings

#### date-fns (MIT)
- **Package**: `date-fns@4.1.0`
- **License**: MIT License
- **Repository**: https://github.com/date-fns/date-fns
- **Description**: Modern JavaScript date utility library

---

### Form Handling (MIT)

#### React Hook Form
- **Package**: `react-hook-form@7.60.0`
- **License**: MIT License
- **Repository**: https://github.com/react-hook-form/react-hook-form
- **Description**: Performant, flexible forms with easy-to-use validation

#### Zod (MIT)
- **Package**: `zod@3.25.76`
- **License**: MIT License
- **Repository**: https://github.com/colinhacks/zod
- **Description**: TypeScript-first schema validation

---

### Vercel Services (MIT)

#### Vercel Analytics
- **Package**: `@vercel/analytics@latest`
- **License**: MIT License
- **Repository**: https://github.com/vercel/analytics
- **Description**: Privacy-friendly analytics

#### Vercel Blob
- **Package**: `@vercel/blob@2.0.0`
- **License**: MIT License
- **Repository**: https://github.com/vercel/storage
- **Description**: Fast, scalable file storage

---

## Development Dependencies

### TypeScript (Apache 2.0)
- **Package**: `typescript@5.0+`
- **License**: Apache License 2.0
- **Repository**: https://github.com/microsoft/TypeScript
- **Description**: Typed superset of JavaScript

### Type Definitions (MIT)
- **Packages**: `@types/node`, `@types/react`, `@types/react-dom`
- **License**: MIT License
- **Repository**: https://github.com/DefinitelyTyped/DefinitelyTyped
- **Description**: TypeScript type definitions

---

## Complete Dependency List

### Direct Dependencies (from package.json)

\`\`\`json
{
  "@hookform/resolvers": "^3.10.0",
  "@radix-ui/react-accordion": "1.2.2",
  "@radix-ui/react-alert-dialog": "1.1.4",
  "@radix-ui/react-aspect-ratio": "1.1.1",
  "@radix-ui/react-avatar": "latest",
  "@radix-ui/react-checkbox": "1.1.3",
  "@radix-ui/react-collapsible": "1.1.2",
  "@radix-ui/react-context-menu": "2.2.4",
  "@radix-ui/react-dialog": "latest",
  "@radix-ui/react-dropdown-menu": "2.1.4",
  "@radix-ui/react-hover-card": "1.1.4",
  "@radix-ui/react-label": "2.1.1",
  "@radix-ui/react-menubar": "1.1.4",
  "@radix-ui/react-navigation-menu": "1.2.3",
  "@radix-ui/react-popover": "1.1.4",
  "@radix-ui/react-progress": "1.1.1",
  "@radix-ui/react-radio-group": "1.2.2",
  "@radix-ui/react-scroll-area": "latest",
  "@radix-ui/react-select": "2.1.4",
  "@radix-ui/react-separator": "1.1.1",
  "@radix-ui/react-slider": "1.2.2",
  "@radix-ui/react-slot": "latest",
  "@radix-ui/react-switch": "1.1.2",
  "@radix-ui/react-tabs": "1.1.2",
  "@radix-ui/react-toast": "latest",
  "@radix-ui/react-toggle": "1.1.1",
  "@radix-ui/react-toggle-group": "1.1.1",
  "@radix-ui/react-tooltip": "1.1.6",
  "@vercel/analytics": "latest",
  "@vercel/blob": "latest",
  "autoprefixer": "^10.4.20",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "1.0.4",
  "date-fns": "4.1.0",
  "embla-carousel-react": "8.5.1",
  "firebase": "latest",
  "input-otp": "1.4.1",
  "lucide-react": "^0.454.0",
  "next": "16.0.0",
  "next-themes": "latest",
  "react": "19.2.0",
  "react-day-picker": "9.8.0",
  "react-dom": "19.2.0",
  "react-hook-form": "^7.60.0",
  "react-resizable-panels": "^2.1.7",
  "recharts": "2.15.4",
  "sonner": "^1.7.4",
  "tailwind-merge": "^2.5.5",
  "tailwindcss-animate": "^1.0.7",
  "vaul": "^0.9.9",
  "zod": "3.25.76"
}
\`\`\`

---

## License Compliance

### Summary by License Type

| License | Count | Commercial Use | Modification | Distribution |
|---------|-------|----------------|--------------|--------------|
| MIT | 45+ | ✅ | ✅ | ✅ |
| Apache 2.0 | 3 | ✅ | ✅ | ✅ |
| ISC | 1 | ✅ | ✅ | ✅ |

### Compliance Requirements

**For MIT Licensed Dependencies**:
- Include copyright notice
- Include license text
- ✅ Satisfied by this document and individual package licenses

**For Apache 2.0 Licensed Dependencies**:
- Include copyright notice
- Include license text
- State changes made
- ✅ Satisfied by this document and version control

**For ISC Licensed Dependencies**:
- Include copyright notice
- ✅ Satisfied by this document

---

## Full License Texts

### MIT License

\`\`\`
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
\`\`\`

### Apache License 2.0

Full text: http://www.apache.org/licenses/LICENSE-2.0

### ISC License

\`\`\`
ISC License

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
\`\`\`

---

## Attribution

We thank all the open-source contributors whose work makes this project possible.

For the most up-to-date list of dependencies, run:
\`\`\`bash
pnpm list --depth=0
\`\`\`

To check for license conflicts:
\`\`\`bash
pnpm licenses list
\`\`\`

---

*Last updated: December 2024*
*This document is automatically generated and maintained*
