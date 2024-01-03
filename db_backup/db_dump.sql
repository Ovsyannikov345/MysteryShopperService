PGDMP      .                 |            MysteryShopperService    16.1    16.0 T               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    59263    MysteryShopperService    DATABASE     �   CREATE DATABASE "MysteryShopperService" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
 '   DROP DATABASE "MysteryShopperService";
                postgres    false            �            1259    59274 	   Companies    TABLE     �   CREATE TABLE public."Companies" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Companies";
       public         heap    postgres    false            �            1259    59273    Companies_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Companies_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Companies_id_seq";
       public          postgres    false    218                       0    0    Companies_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Companies_id_seq" OWNED BY public."Companies".id;
          public          postgres    false    217            �            1259    59347    CompanyReviews    TABLE     �   CREATE TABLE public."CompanyReviews" (
    id integer NOT NULL,
    text character varying(255),
    grade smallint NOT NULL,
    "UserId" integer,
    "OrderId" integer
);
 $   DROP TABLE public."CompanyReviews";
       public         heap    postgres    false            �            1259    59346    CompanyReviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public."CompanyReviews_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public."CompanyReviews_id_seq";
       public          postgres    false    228                       0    0    CompanyReviews_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."CompanyReviews_id_seq" OWNED BY public."CompanyReviews".id;
          public          postgres    false    227            �            1259    59283    ContactPeople    TABLE     .  CREATE TABLE public."ContactPeople" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    surname character varying(255) NOT NULL,
    patronymic character varying(255),
    phone character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    "CompanyId" integer
);
 #   DROP TABLE public."ContactPeople";
       public         heap    postgres    false            �            1259    59282    ContactPeople_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ContactPeople_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."ContactPeople_id_seq";
       public          postgres    false    220                       0    0    ContactPeople_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public."ContactPeople_id_seq" OWNED BY public."ContactPeople".id;
          public          postgres    false    219            �            1259    59297    Orders    TABLE     6  CREATE TABLE public."Orders" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255),
    place character varying(255) NOT NULL,
    "completionTime" smallint,
    price integer,
    "createdAt" timestamp with time zone NOT NULL,
    "CompanyId" integer
);
    DROP TABLE public."Orders";
       public         heap    postgres    false            �            1259    59296    Orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Orders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public."Orders_id_seq";
       public          postgres    false    222                       0    0    Orders_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public."Orders_id_seq" OWNED BY public."Orders".id;
          public          postgres    false    221            �            1259    59328    Reports    TABLE     �   CREATE TABLE public."Reports" (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    grade smallint NOT NULL,
    "UserId" integer,
    "OrderId" integer
);
    DROP TABLE public."Reports";
       public         heap    postgres    false            �            1259    59327    Reports_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Reports_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Reports_id_seq";
       public          postgres    false    226                       0    0    Reports_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Reports_id_seq" OWNED BY public."Reports".id;
          public          postgres    false    225            �            1259    59311    Requests    TABLE     �   CREATE TABLE public."Requests" (
    id integer NOT NULL,
    accepted boolean NOT NULL,
    "UserId" integer,
    "OrderId" integer,
    rejected boolean NOT NULL
);
    DROP TABLE public."Requests";
       public         heap    postgres    false            �            1259    59310    Requests_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Requests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Requests_id_seq";
       public          postgres    false    224                       0    0    Requests_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public."Requests_id_seq" OWNED BY public."Requests".id;
          public          postgres    false    223            �            1259    59381    SupportRequests    TABLE     �   CREATE TABLE public."SupportRequests" (
    id integer NOT NULL,
    text character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "UserId" integer,
    "CompanyId" integer
);
 %   DROP TABLE public."SupportRequests";
       public         heap    postgres    false            �            1259    59380    SupportRequests_id_seq    SEQUENCE     �   CREATE SEQUENCE public."SupportRequests_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."SupportRequests_id_seq";
       public          postgres    false    232                       0    0    SupportRequests_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public."SupportRequests_id_seq" OWNED BY public."SupportRequests".id;
          public          postgres    false    231            �            1259    59397 
   UserOrders    TABLE     d   CREATE TABLE public."UserOrders" (
    "UserId" integer NOT NULL,
    "OrderId" integer NOT NULL
);
     DROP TABLE public."UserOrders";
       public         heap    postgres    false            �            1259    59364    UserReviews    TABLE     �   CREATE TABLE public."UserReviews" (
    id integer NOT NULL,
    text character varying(255),
    grade smallint NOT NULL,
    "CompanyId" integer,
    "ReportId" integer
);
 !   DROP TABLE public."UserReviews";
       public         heap    postgres    false            �            1259    59363    UserReviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public."UserReviews_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."UserReviews_id_seq";
       public          postgres    false    230                        0    0    UserReviews_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."UserReviews_id_seq" OWNED BY public."UserReviews".id;
          public          postgres    false    229            �            1259    59265    Users    TABLE     �  CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    surname character varying(255) NOT NULL,
    patronymic character varying(255),
    age smallint,
    city character varying(255),
    phone character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    description character varying(255),
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Users";
       public         heap    postgres    false            �            1259    59264    Users_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Users_id_seq";
       public          postgres    false    216            !           0    0    Users_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;
          public          postgres    false    215            G           2604    59277    Companies id    DEFAULT     p   ALTER TABLE ONLY public."Companies" ALTER COLUMN id SET DEFAULT nextval('public."Companies_id_seq"'::regclass);
 =   ALTER TABLE public."Companies" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217    218            L           2604    59350    CompanyReviews id    DEFAULT     z   ALTER TABLE ONLY public."CompanyReviews" ALTER COLUMN id SET DEFAULT nextval('public."CompanyReviews_id_seq"'::regclass);
 B   ALTER TABLE public."CompanyReviews" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    228    228            H           2604    59286    ContactPeople id    DEFAULT     x   ALTER TABLE ONLY public."ContactPeople" ALTER COLUMN id SET DEFAULT nextval('public."ContactPeople_id_seq"'::regclass);
 A   ALTER TABLE public."ContactPeople" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            I           2604    59300 	   Orders id    DEFAULT     j   ALTER TABLE ONLY public."Orders" ALTER COLUMN id SET DEFAULT nextval('public."Orders_id_seq"'::regclass);
 :   ALTER TABLE public."Orders" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            K           2604    59331 
   Reports id    DEFAULT     l   ALTER TABLE ONLY public."Reports" ALTER COLUMN id SET DEFAULT nextval('public."Reports_id_seq"'::regclass);
 ;   ALTER TABLE public."Reports" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    226    226            J           2604    59314    Requests id    DEFAULT     n   ALTER TABLE ONLY public."Requests" ALTER COLUMN id SET DEFAULT nextval('public."Requests_id_seq"'::regclass);
 <   ALTER TABLE public."Requests" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    224    224            N           2604    59384    SupportRequests id    DEFAULT     |   ALTER TABLE ONLY public."SupportRequests" ALTER COLUMN id SET DEFAULT nextval('public."SupportRequests_id_seq"'::regclass);
 C   ALTER TABLE public."SupportRequests" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    232    232            M           2604    59367    UserReviews id    DEFAULT     t   ALTER TABLE ONLY public."UserReviews" ALTER COLUMN id SET DEFAULT nextval('public."UserReviews_id_seq"'::regclass);
 ?   ALTER TABLE public."UserReviews" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    230    230            F           2604    59268    Users id    DEFAULT     h   ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);
 9   ALTER TABLE public."Users" ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216                      0    59274 	   Companies 
   TABLE DATA           M   COPY public."Companies" (id, name, email, password, "createdAt") FROM stdin;
    public          postgres    false    218   _h                 0    59347    CompanyReviews 
   TABLE DATA           P   COPY public."CompanyReviews" (id, text, grade, "UserId", "OrderId") FROM stdin;
    public          postgres    false    228   ;i                 0    59283    ContactPeople 
   TABLE DATA           c   COPY public."ContactPeople" (id, name, surname, patronymic, phone, email, "CompanyId") FROM stdin;
    public          postgres    false    220   �i                 0    59297    Orders 
   TABLE DATA           t   COPY public."Orders" (id, title, description, place, "completionTime", price, "createdAt", "CompanyId") FROM stdin;
    public          postgres    false    222   Dj                 0    59328    Reports 
   TABLE DATA           W   COPY public."Reports" (id, title, description, grade, "UserId", "OrderId") FROM stdin;
    public          postgres    false    226   l       	          0    59311    Requests 
   TABLE DATA           Q   COPY public."Requests" (id, accepted, "UserId", "OrderId", rejected) FROM stdin;
    public          postgres    false    224   xm                 0    59381    SupportRequests 
   TABLE DATA           Y   COPY public."SupportRequests" (id, text, "createdAt", "UserId", "CompanyId") FROM stdin;
    public          postgres    false    232   �m                 0    59397 
   UserOrders 
   TABLE DATA           ;   COPY public."UserOrders" ("UserId", "OrderId") FROM stdin;
    public          postgres    false    233   o                 0    59364    UserReviews 
   TABLE DATA           Q   COPY public."UserReviews" (id, text, grade, "CompanyId", "ReportId") FROM stdin;
    public          postgres    false    230   2o                 0    59265    Users 
   TABLE DATA           }   COPY public."Users" (id, name, surname, patronymic, age, city, phone, email, description, password, "createdAt") FROM stdin;
    public          postgres    false    216   �o       "           0    0    Companies_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Companies_id_seq"', 18, true);
          public          postgres    false    217            #           0    0    CompanyReviews_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."CompanyReviews_id_seq"', 6, true);
          public          postgres    false    227            $           0    0    ContactPeople_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public."ContactPeople_id_seq"', 6, true);
          public          postgres    false    219            %           0    0    Orders_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Orders_id_seq"', 11, true);
          public          postgres    false    221            &           0    0    Reports_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public."Reports_id_seq"', 6, true);
          public          postgres    false    225            '           0    0    Requests_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Requests_id_seq"', 21, true);
          public          postgres    false    223            (           0    0    SupportRequests_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public."SupportRequests_id_seq"', 5, true);
          public          postgres    false    231            )           0    0    UserReviews_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."UserReviews_id_seq"', 10, true);
          public          postgres    false    229            *           0    0    Users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."Users_id_seq"', 4, true);
          public          postgres    false    215            R           2606    59281    Companies Companies_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public."Companies"
    ADD CONSTRAINT "Companies_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY public."Companies" DROP CONSTRAINT "Companies_pkey";
       public            postgres    false    218            \           2606    59352 "   CompanyReviews CompanyReviews_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."CompanyReviews"
    ADD CONSTRAINT "CompanyReviews_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."CompanyReviews" DROP CONSTRAINT "CompanyReviews_pkey";
       public            postgres    false    228            T           2606    59290     ContactPeople ContactPeople_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public."ContactPeople"
    ADD CONSTRAINT "ContactPeople_pkey" PRIMARY KEY (id);
 N   ALTER TABLE ONLY public."ContactPeople" DROP CONSTRAINT "ContactPeople_pkey";
       public            postgres    false    220            V           2606    59304    Orders Orders_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY public."Orders" DROP CONSTRAINT "Orders_pkey";
       public            postgres    false    222            Z           2606    59335    Reports Reports_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Reports" DROP CONSTRAINT "Reports_pkey";
       public            postgres    false    226            X           2606    59316    Requests Requests_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Requests"
    ADD CONSTRAINT "Requests_pkey" PRIMARY KEY (id);
 D   ALTER TABLE ONLY public."Requests" DROP CONSTRAINT "Requests_pkey";
       public            postgres    false    224            `           2606    59386 $   SupportRequests SupportRequests_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."SupportRequests"
    ADD CONSTRAINT "SupportRequests_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."SupportRequests" DROP CONSTRAINT "SupportRequests_pkey";
       public            postgres    false    232            b           2606    59401    UserOrders UserOrders_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public."UserOrders"
    ADD CONSTRAINT "UserOrders_pkey" PRIMARY KEY ("UserId", "OrderId");
 H   ALTER TABLE ONLY public."UserOrders" DROP CONSTRAINT "UserOrders_pkey";
       public            postgres    false    233    233            ^           2606    59369    UserReviews UserReviews_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."UserReviews"
    ADD CONSTRAINT "UserReviews_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."UserReviews" DROP CONSTRAINT "UserReviews_pkey";
       public            postgres    false    230            P           2606    59272    Users Users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public            postgres    false    216            i           2606    99805 *   CompanyReviews CompanyReviews_OrderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CompanyReviews"
    ADD CONSTRAINT "CompanyReviews_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 X   ALTER TABLE ONLY public."CompanyReviews" DROP CONSTRAINT "CompanyReviews_OrderId_fkey";
       public          postgres    false    228    222    4694            j           2606    99800 )   CompanyReviews CompanyReviews_UserId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CompanyReviews"
    ADD CONSTRAINT "CompanyReviews_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 W   ALTER TABLE ONLY public."CompanyReviews" DROP CONSTRAINT "CompanyReviews_UserId_fkey";
       public          postgres    false    228    4688    216            c           2606    99770 *   ContactPeople ContactPeople_CompanyId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."ContactPeople"
    ADD CONSTRAINT "ContactPeople_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES public."Companies"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 X   ALTER TABLE ONLY public."ContactPeople" DROP CONSTRAINT "ContactPeople_CompanyId_fkey";
       public          postgres    false    4690    220    218            d           2606    99775    Orders Orders_CompanyId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES public."Companies"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 J   ALTER TABLE ONLY public."Orders" DROP CONSTRAINT "Orders_CompanyId_fkey";
       public          postgres    false    4690    222    218            g           2606    99795    Reports Reports_OrderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 J   ALTER TABLE ONLY public."Reports" DROP CONSTRAINT "Reports_OrderId_fkey";
       public          postgres    false    226    4694    222            h           2606    99790    Reports Reports_UserId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reports"
    ADD CONSTRAINT "Reports_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 I   ALTER TABLE ONLY public."Reports" DROP CONSTRAINT "Reports_UserId_fkey";
       public          postgres    false    216    226    4688            e           2606    99785    Requests Requests_OrderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Requests"
    ADD CONSTRAINT "Requests_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 L   ALTER TABLE ONLY public."Requests" DROP CONSTRAINT "Requests_OrderId_fkey";
       public          postgres    false    4694    224    222            f           2606    99780    Requests Requests_UserId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Requests"
    ADD CONSTRAINT "Requests_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 K   ALTER TABLE ONLY public."Requests" DROP CONSTRAINT "Requests_UserId_fkey";
       public          postgres    false    4688    224    216            m           2606    99825 .   SupportRequests SupportRequests_CompanyId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."SupportRequests"
    ADD CONSTRAINT "SupportRequests_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES public."Companies"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 \   ALTER TABLE ONLY public."SupportRequests" DROP CONSTRAINT "SupportRequests_CompanyId_fkey";
       public          postgres    false    232    218    4690            n           2606    99820 +   SupportRequests SupportRequests_UserId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."SupportRequests"
    ADD CONSTRAINT "SupportRequests_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Y   ALTER TABLE ONLY public."SupportRequests" DROP CONSTRAINT "SupportRequests_UserId_fkey";
       public          postgres    false    232    4688    216            o           2606    59407 "   UserOrders UserOrders_OrderId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserOrders"
    ADD CONSTRAINT "UserOrders_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES public."Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY public."UserOrders" DROP CONSTRAINT "UserOrders_OrderId_fkey";
       public          postgres    false    4694    222    233            p           2606    59402 !   UserOrders UserOrders_UserId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserOrders"
    ADD CONSTRAINT "UserOrders_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public."UserOrders" DROP CONSTRAINT "UserOrders_UserId_fkey";
       public          postgres    false    216    233    4688            k           2606    99810 &   UserReviews UserReviews_CompanyId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserReviews"
    ADD CONSTRAINT "UserReviews_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES public."Companies"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 T   ALTER TABLE ONLY public."UserReviews" DROP CONSTRAINT "UserReviews_CompanyId_fkey";
       public          postgres    false    4690    218    230            l           2606    99815 %   UserReviews UserReviews_ReportId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserReviews"
    ADD CONSTRAINT "UserReviews_ReportId_fkey" FOREIGN KEY ("ReportId") REFERENCES public."Reports"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 S   ALTER TABLE ONLY public."UserReviews" DROP CONSTRAINT "UserReviews_ReportId_fkey";
       public          postgres    false    230    4698    226               �   x�34�0�¾[.�S�0��m�.lP�0����/l��p��b���Ԋ�܂�T��������\N�$C�|��r��P���ܢ �`���B׀Ђ���2㒐�DS���b� ���oN##c]C#]#S+s+C3=KCmc.C����sa���]ԯ`���!����X�XZ�ꙘX����� ��d�         e   x���	�@D����H�h5#�x�����f���v���f�iKy��,���本N"��Ϫx�љT���em`֧o�N�4�X)4���*3� �E:�         �   x�3�0�¦.�3.컰	�sa��vNmcsSccMs3]#]S�Ԋ�܂�Tc��������\NCs.3�/l��pa�v"s���E�"���41��57�5��,H-*�ϋ/N-JO�D6݂+F��� �Tp         �  x���KN�@���SxO�+��!8�i� !�`��H%(��+xn��IZ�SBH%�����v������{����'q�Q����qĳ��<�i�s�=V�/ໃmO��n�2������O����}2jkS����؂�6y�Ƭi��z����op#�_�?j�\?�Y�M�	��FιN�s� �*�+��;~Nք�g�����GEp�oB����>���L �n�?_�&H��(�Å�
ij��=ϓ)�Q�[��
����Œ4˲m�5�(>mE�*�_5y+�gd�ʕ[�f�L�Zge��iS*Q��?�G�A#�@Lb���D^}+��r���y	de��]f�/DF�٢ԍc�N���1L��J��;$��i�k~��\E�*Y�8��e=�Q.a.i��g�َq+��zoV��         a  x�}QKJ1]w��0~FO�RܹsӓZН������ ��*6~��P��/�ʍ��JU�W��v2��m\�I/�|�&.p��Z:�7y�/��o/��&;����g.�T��6��SQk?"e���k*J��Sl�HW��t��٪b�>�lȳQ\�.B�nD\҅v������9�l�=�TE�c:F��l��*mG���7 �(WQ�gx�O���*�P*Ԯ0����$�|/�GH~�������\�}���s�n���C!!��>�A|�i�q��=�t[i��p�l�[X�����Z��Pjg;?��g�rH:��M̙܂�g���/�Bq����p:���A�      	   S   x�Mͱ�0������a�L��x��(8�B����SNvO��S0���G.��W���y�Q|�F�x�2m����ץ��W�           x�ݐ;N�0���ӓ���n`kJ�]��m-#9��S�D�$�X�x^���4܀jF����G�]X���H������ a�W���=z�fJ#1�$�VkHA�B#PC0���/ %\+O�:�n�`o�<EI�`�Q��:���-@�\+�R^��]�Ӟ)tn�sz!��{�Yϲ�W͂�^�k~�槬��^gM�m�&�O�+������{a����~����&y�!~O7���<��ǿ�a�U��^��?��ޖ-�j>��de�w,�����             x�3�4�2�4b 64�21z\\\ 0*f         �   x��O[
�@�NN�'�}�]<����B��~
k�(T�W���i��,a�I2��7��iG4���=Z�.�h����#��T�B-W�lx�S��(�%�����CC�-�hۏ;J�V��&itv"�h��Jb�i2�������v�����u=S�/v«�         �  x�]QMo�@=;�b9�[��#NN�4Q���D!���^�%k����F�
N����U�"���6Ri�4�F�f��,�Eo�7�Bo�`������~o���M��L�ק�����{�s��vٱo)A��<���<��W����W�x�����Ro@_�������3�}V�YM4ozn�;`��U���$�=}�&���I6��}>-��a�G8{b��/��뵅\���Qu��E�����7|K2N�����u����K6�b��Y��D�"�X�$�KF�X��@K�r�8�*!͉l� X�*H3ZR�i� ¨t`"Ap�(�Re� IL3UH�SUQ����I犙�����WRRy��d$���Y
���- 
��9L�a	]�*��iH� ��)�*i��¹I�x���O�C�-��G�I���h�8\戕�;���ä�ý�h��O��|z�@.�Q׏/�%��i4 O�	     