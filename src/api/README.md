# API client

This folder provides a centralized `client` wrapper around `fetch` and an `AuthContext` to manage tokens.

Usage examples:

- Call endpoints:

```ts
import { client } from "../api/client";

const users = await client.get('/api/users');
const item = await client.post('/api/items', { name: 'x' });
```

- Use RTK Query hooks (recommended) and the `auth` slice to manage tokens. Example:

```tsx
import { useLoginMutation } from '../features/api/apiSlice';
import { useAppDispatch } from '../hooks';
import { setCredentials } from '../features/auth/authSlice';

const [login] = useLoginMutation();
const dispatch = useAppDispatch();

const res = await login({ email, password, otp }).unwrap();
if (res.token) dispatch(setCredentials({ token: res.token, user: res.user }));
```

- If you prefer the original `AuthContext`, it is available under `src/context/AuthContext.tsx`, but RTK is recommended for central state and API handling.

- Configure base URL using Vite environment variable `VITE_API_BASE_URL`.

Notes:
- The client automatically injects `Authorization: Bearer <token>` from `localStorage` when available.
- 401 handling and refresh token support can be extended in `client.request`.
