create table users
(
    id            serial
        constraint "PK_a3ffb1c0c8416b9fc6f907b7433"
            primary key,
    role          varchar   default 'USER'::character varying not null,
    email         varchar                                     not null
        constraint "UQ_97672ac88f789774dd47f7c8be3"
            unique,
    password      varchar                                     not null,
    nickname      varchar                                     not null,
    profile_image varchar,
    is_disabled   boolean   default false                     not null,
    "createdAt"   timestamp default now()                     not null,
    "updatedAt"   timestamp default now()                     not null
);

alter table users
    owner to postgres;

create table videos
(
    id                  serial
        constraint "PK_e4c86c0cf95aff16e9fb8220f6b"
            primary key,
    uuid                varchar                 not null,
    base_dir            varchar                 not null,
    thumbnail_file_name varchar                 not null,
    hls_file_name       varchar                 not null,
    video_file_name     varchar                 not null,
    is_deleted          boolean   default false not null,
    "createdAt"         timestamp default now() not null,
    "updatedAt"         timestamp default now() not null,
    "userId"            integer
        constraint "FK_9003d36fcc646f797c42074d82b"
            references users
);

alter table videos
    owner to postgres;