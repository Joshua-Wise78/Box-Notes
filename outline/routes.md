# Route-88 API Documentation (v1)

**Base URL:** `/api/v1`

---

## Notes
**Route Prefix:** `/note`

### `POST /`
*Creates a singular note.*

#### Request Payload
| Field | Type | Description |
| :--- | :--- | :--- |
| `vault_id` | Integer | The ID of the parent vault. |
| `title` | String | The title of the note. |
| `body` | String | The raw markdown content. |

#### System Generated
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Globally unique identifier for the note. |
| `slug` | String | URL-safe parsed version of the title. |
| `content_hash` | String | Hash of the body for physical VFS backups. |
| `created_at` | Timestamp | Automatically set on creation. |
| `updated_at` | Timestamp | Automatically set on creation/modification. |

### `GET /:id`
*Get a singular note.*

#### Request Path
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | The ID of the note. |

#### Server Returns
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Globally unique identifier for the note. |
| `slug` | String | URL-safe parsed version of the title. |
| `content_hash` | String | Hash of the body for physical VFS backups. |
| `title` | String | The title of the note. |
| `body` | Text | The contents of the file aka the markdown text. |
| `vault_id` | Integer | ID of the vault that holds the note. |
| `is_archived` | Boolean | Value if the note is archived or not. |
| `updated_at` | Timestamp | Automatically set on creation/modification. |

### `PATCH /:id`
*Updates an existing note's metadata or content.*

#### Request Path
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | The ID of the note to update. |

#### Request Payload (All Optional)
| Field | Type | Description |
| :--- | :--- | :--- |
| `title` | String | New title (will trigger a slug update). |
| `body` | Text | New markdown content (will trigger a hash update). |
| `vault_id` | Integer | Move the note to a new vault. |
| `is_archived` | Boolean | Archive or unarchive the note. |

---

## Vaults
**Route Prefix:** `/vault`

### `POST /`
*Creates a new vault container.*

#### Request Payload
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | The display name of the vault. |
| `description` | String | Optional context about the vault. |

#### System Generated
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | Primary key for the vault. |
| `created_at` | Timestamp | Automatically set on creation. |

### `GET /`
*Retrieves a list of all existing vaults.*

#### Server Returns
| Field | Type | Description |
| :--- | :--- | :--- |
| `vaults` | Array | A JSON array containing all vault objects (`id`, `name`, `description`). |

### `POST /:id/backup`
*Manually triggers a physical VFS backup for all notes in the vault.*

#### Request Path
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | The ID of the vault to backup. |

#### Server Returns
| Field | Type | Description |
| :--- | :--- | :--- |
| `status` | String | E.g., "Backup queued successfully". |

---

## Symbolic Links
**Route Prefix:** `/link`

### `POST /`
*Creates a conceptual link between two notes.*

#### Request Payload
| Field | Type | Description |
| :--- | :--- | :--- |
| `source_note_id` | UUID | The ID of the note containing the link. |
| `target_note_id` | UUID | The ID of the note being linked to. |
| `label` | String | (Optional) Alias text used in the markdown for the link. |

### `GET /note/:note_id`
*Retrieves all links originating from or pointing to a specific note.*

#### Request Path
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `note_id` | UUID | The ID of the central note. |

#### Server Returns
| Field | Type | Description |
| :--- | :--- | :--- |
| `forward_links` | Array | Notes this note links TO. |
| `back_links` | Array | Notes that link TO this note. |

### `DELETE /:id`
*Removes a symbolic link.*

#### Request Path
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | The primary ID of the link to remove. |

---

## Mount Points
**Route Prefix:** `/mount`

### `POST /`
*Configures a physical backup location for a VFS vault.*

#### Request Payload
| Field | Type | Description |
| :--- | :--- | :--- |
| `vault_id` | Integer | The ID of the vault being mounted. |
| `backend_type` | String | E.g., 'vfs' or 'local'. |
| `backup_path` | String | The absolute file path on the server (e.g., `/home/user/notes`). |
| `sync_enabled` | Boolean | Whether procedural backups should run automatically. |

---

### `PATCH /:id`
*Updates the mount configuration.*

#### Request Path
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | The ID of the mount point. |

#### Request Payload (All Optional)
| Field | Type | Description |
| :--- | :--- | :--- |
| `backup_path` | String | Change the physical backup directory. |
| `sync_enabled` | Boolean | Pause or resume procedural syncing. |