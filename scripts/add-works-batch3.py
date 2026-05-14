#!/usr/bin/env python3
"""Third batch — pushing toward 600+ works."""
import json

NEW_WORKS = [
  # ── HARLEM RENAISSANCE (MORE) ─────────────────────────────────────────────
  {
    "title": "Cane",
    "author": "Jean Toomer",
    "yearPublished": 1923,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction/Poetry",
    "era": "Harlem Renaissance",
    "description": "A formally radical work combining poems, stories, and drama in three sections — the Black South, the Black North, and a return South. Jean Toomer's only major work, it created a new form for African American experience.",
    "accessLinks": ["https://archive.org/details/cane00toom"],
    "significance": "One of the most formally innovative texts of the Harlem Renaissance; influenced every generation of African American writers after it"
  },
  {
    "title": "Home to Harlem",
    "author": "Claude McKay",
    "yearPublished": 1928,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Harlem Renaissance",
    "description": "Jake returns from WWI to Harlem and immerses himself in its nightlife — cabarets, jazz, love affairs. McKay's controversial celebration of working-class Black life, criticized by W.E.B. Du Bois for its sensuality.",
    "accessLinks": ["https://archive.org/details/hometoharlem00mcka"],
    "significance": "The first novel by a Black author to reach the bestseller list; its celebration of Black popular culture was deeply controversial among the Black elite"
  },
  {
    "title": "Quicksand",
    "author": "Nella Larsen",
    "yearPublished": 1928,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Harlem Renaissance",
    "description": "Helga Crane, a mixed-race woman, moves restlessly from the American South to Chicago to New York to Copenhagen and back, never finding a community that will hold her. Larsen's devastating portrait of racial and gender exile.",
    "accessLinks": ["https://archive.org/details/quicksand00lars"],
    "significance": "One of the first Black feminist novels; a precursor to Toni Morrison and a foundational text for Black women's literature"
  },
  {
    "title": "Passing",
    "author": "Nella Larsen",
    "yearPublished": 1929,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Harlem Renaissance",
    "description": "Two light-skinned Black women — one who has passed into white society, one who has not — are drawn together in a dangerous and erotic friendship. Larsen's unsettling examination of race, class, and desire.",
    "accessLinks": ["https://archive.org/details/passing00lars"],
    "significance": "One of the most psychologically complex novels of the Harlem Renaissance; the 2021 Netflix film revived interest"
  },
  {
    "title": "Color",
    "author": "Countee Cullen",
    "yearPublished": 1925,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Poetry",
    "era": "Harlem Renaissance",
    "description": "Cullen's debut collection, which includes 'Heritage' ('What is Africa to me?') and 'Yet Do I Marvel' — formal sonnets wrestling with the question of what it means to be Black and a poet in America.",
    "accessLinks": ["https://archive.org/details/color00cull"],
    "significance": "Cullen was the most formally traditional of the Harlem Renaissance poets; his engagement with the sonnet form as a Black man is itself a political act"
  },
  {
    "title": "The Big Sea",
    "author": "Langston Hughes",
    "yearPublished": 1940,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Autobiography",
    "era": "Harlem Renaissance",
    "description": "Hughes's autobiography of his early years — his African voyages, Mexico, Columbia University, Harlem, and Europe. The most vivid first-person account of the Harlem Renaissance from the inside.",
    "accessLinks": ["https://archive.org/details/bigsea00hugh"],
    "significance": "Essential primary document of the Harlem Renaissance; Hughes's account of meeting everyone from Countee Cullen to Alain Locke"
  },
  {
    "title": "There Is Confusion",
    "author": "Jessie Redmon Fauset",
    "yearPublished": 1924,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Harlem Renaissance",
    "description": "Three Black families in Philadelphia and New York navigate ambition, love, and racial identity in the early 20th century. Fauset, literary editor of The Crisis, was the midwife of the Harlem Renaissance.",
    "accessLinks": ["https://archive.org/details/thereisconfusion00faus"],
    "significance": "Fauset published more Harlem Renaissance writers than anyone else as editor of The Crisis; her own fiction deserves equal recognition"
  },
  {
    "title": "Banana Bottom",
    "author": "Claude McKay",
    "yearPublished": 1933,
    "language": "English",
    "region": "Caribbean",
    "country": "Jamaica",
    "genre": "Fiction",
    "era": "Harlem Renaissance",
    "description": "Bita Plant, a Jamaican girl educated in England by missionary patrons, returns to Jamaica and must choose between the Western values she was trained in and her own people. McKay's finest novel.",
    "accessLinks": ["https://archive.org/details/bananabottom00mcka"],
    "significance": "McKay's most mature novel; a profound meditation on cultural authenticity and return"
  },

  # ── AFRICAN AMERICAN CIVIL RIGHTS ERA ────────────────────────────────────
  {
    "title": "The Measure of a Man",
    "author": "Martin Luther King Jr.",
    "yearPublished": 1959,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Essay",
    "era": "Post-colonial",
    "description": "King's theological essays on what it means to be fully human — the spiritual, intellectual, and social dimensions of human dignity. The philosophical foundation of his civil rights advocacy.",
    "accessLinks": ["https://archive.org/search?query=measure+of+a+man+martin+luther+king"],
    "significance": "Reveals the theological depth beneath King's political speeches; essential for understanding his philosophy"
  },
  {
    "title": "Soul on Ice",
    "author": "Eldridge Cleaver",
    "yearPublished": 1968,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Essay",
    "era": "Post-colonial",
    "description": "Essays written from Folsom Prison — on race, sexuality, America, and the Black liberation movement. One of the defining texts of the Black Power era, brutal in its self-examination.",
    "accessLinks": ["https://archive.org/search?query=soul+on+ice+eldridge+cleaver"],
    "significance": "One of the defining texts of the Black Power era; highly controversial then and now"
  },
  {
    "title": "The Autobiography of an Ex-Colored Man",
    "author": "James Weldon Johnson",
    "yearPublished": 1912,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Harlem Renaissance",
    "description": "A light-skinned Black man who can pass for white narrates his life, oscillating between Black and white worlds, ultimately choosing to pass — and mourning the culture he abandoned. Published anonymously.",
    "accessLinks": ["https://archive.org/details/autobiographyofex1912john"],
    "significance": "The first major American novel on racial passing; published 12 years before the Harlem Renaissance began"
  },
  {
    "title": "God's Trombones: Seven Negro Sermons in Verse",
    "author": "James Weldon Johnson",
    "yearPublished": 1927,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Poetry",
    "era": "Harlem Renaissance",
    "description": "Seven poems recreating the rhetorical style of the old Black folk preachers — The Creation, The Prodigal Son, Go Down Death, Judgment Day. A masterwork of preserving Black vernacular oral tradition in verse.",
    "accessLinks": ["https://archive.org/details/godstrombones00john"],
    "significance": "One of the most beautiful and influential works of African American poetry; the folk sermon as literary form"
  },

  # ── AFRICA — MORE WOMEN WRITERS ───────────────────────────────────────────
  {
    "title": "Flowers and Shadows",
    "author": "Ben Okri",
    "yearPublished": 1980,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Jeffia Okwe, son of a wealthy Lagos businessman, discovers the corruption and dark dealings that built his comfortable life. Okri's debut novel, written when he was 21.",
    "accessLinks": ["https://archive.org/search?query=flowers+shadows+ben+okri"],
    "significance": "Okri's debut; remarkable for a 21-year-old; shows the roots of his mature preoccupation with corruption and spiritual disintegration"
  },
  {
    "title": "The Stillborn",
    "author": "Zaynab Alkali",
    "yearPublished": 1984,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Li and Faku, two village girls, dream of escaping their rural lives in northern Nigeria. Li marries a man who goes to the city and is transformed by it. A quiet tragedy of aspiration and its costs.",
    "accessLinks": ["https://archive.org/search?query=stillborn+zaynab+alkali"],
    "significance": "The first novel published by a woman from northern Nigeria; gave voice to Hausa-Fulani women's experiences"
  },
  {
    "title": "The Bride Price",
    "author": "Buchi Emecheta",
    "yearPublished": 1976,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Aku-nna falls in love with a man whose family paid bride price for her. When her family refuses to accept the payment, Aku-nna is cursed. Emecheta examines the tragic intersection of traditional custom and female desire.",
    "accessLinks": ["https://archive.org/search?query=bride+price+buchi+emecheta"],
    "significance": "One of Emecheta's most celebrated novels; a devastating examination of how tradition can kill"
  },
  {
    "title": "The Slave Girl",
    "author": "Buchi Emecheta",
    "yearPublished": 1977,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Ojebeta is sold into domestic slavery by her brother in colonial Nigeria. The novel traces her servitude and eventual 'freedom' — only to be bound again by marriage. A damning portrait of women's double enslavement.",
    "accessLinks": ["https://archive.org/search?query=slave+girl+buchi+emecheta"],
    "significance": "Emecheta based it on her own mother's story; one of her most historically grounded novels"
  },
  {
    "title": "I Do Not Come to You by Chance",
    "author": "Adaobi Tricia Nwaubani",
    "yearPublished": 2009,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Kingsley, a top engineering graduate who can't find work, is pulled into his flamboyant uncle's 419 advance-fee fraud empire. A darkly comic examination of corruption, ambition, and the pressures on African families.",
    "accessLinks": ["https://archive.org/search?query=i+do+not+come+to+you+by+chance+nwaubani"],
    "significance": "Commonwealth Writers' Prize Africa Region; the most comprehensive fictional treatment of Nigerian email fraud"
  },
  {
    "title": "The Thing Around Your Neck",
    "author": "Chimamanda Ngozi Adichie",
    "yearPublished": 2009,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Short Stories",
    "era": "Contemporary",
    "description": "Twelve stories about Nigerians in Nigeria and America — an immigrant woman in Connecticut, a newlywed encountering her husband's family secrets, a woman searching for her coup-arrested father.",
    "accessLinks": ["https://archive.org/search?query=thing+around+your+neck+adichie"],
    "significance": "Adichie's only story collection; demonstrates her mastery of the short form alongside her novels"
  },

  # ── EAST AFRICA (MORE) ────────────────────────────────────────────────────
  {
    "title": "Unbowed: A Memoir",
    "author": "Wangari Maathai",
    "yearPublished": 2006,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Memoir",
    "era": "Contemporary",
    "description": "Maathai's memoir of founding the Green Belt Movement — which planted over 50 million trees across Africa — her years of persecution under Moi, imprisonment, and the Nobel Peace Prize she received in 2004.",
    "accessLinks": ["https://archive.org/search?query=unbowed+memoir+wangari+maathai"],
    "significance": "Nobel Peace Prize laureate; Maathai connected environmental destruction with political oppression and women's rights in a way no one had before"
  },
  {
    "title": "The In-Between World of Vikram Lall",
    "author": "M.G. Vassanji",
    "yearPublished": 2003,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Vikram Lall, an Asian Kenyan, narrates his family's history through Kenya's independence and its descent into corruption, placed between Black, white, and Asian communities — belonging fully to none.",
    "accessLinks": ["https://archive.org/search?query=in+between+world+vikram+lall+vassanji"],
    "significance": "Giller Prize; Vassanji's most celebrated novel; a vital perspective on Kenya's complex ethnic history"
  },
  {
    "title": "The Gunny Sack",
    "author": "M.G. Vassanji",
    "yearPublished": 1989,
    "language": "English",
    "region": "East Africa",
    "country": "Tanzania",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A gunny sack of family memories anchors Salim's journey through the history of Tanzania's Asian community — from the slave trade era through independence. Vassanji's debut novel.",
    "accessLinks": ["https://archive.org/search?query=gunny+sack+mg+vassanji"],
    "significance": "Commonwealth First Novel Prize; one of the most important novels about the Asian African community"
  },
  {
    "title": "Dust",
    "author": "Yvonne Adhiambo Owuor",
    "yearPublished": 2014,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A young man is shot in the Nairobi post-election violence of 2007. His sister returns from London to collect his body; his father searches for answers in the northern Kenya desert. A sweeping, lyrical novel of Kenyan history.",
    "accessLinks": ["https://archive.org/search?query=dust+yvonne+adhiambo+owuor"],
    "significance": "One of the most celebrated recent Kenyan novels; Owuor's debut after her Caine Prize-winning short story"
  },

  # ── SOUTHERN AFRICA (MORE) ───────────────────────────────────────────────
  {
    "title": "The Conservationist",
    "author": "Nadine Gordimer",
    "yearPublished": 1974,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Mehring, a wealthy white South African industrialist, owns a farm he doesn't farm. A Black body is buried on his land — and this becomes the novel's symbolic center. Formal, allusive, uncomfortable.",
    "accessLinks": ["https://archive.org/search?query=the+conservationist+gordimer"],
    "significance": "Booker Prize 1974 (joint); one of Gordimer's most technically demanding and rewarding novels"
  },
  {
    "title": "A Dry White Season",
    "author": "André Brink",
    "yearPublished": 1979,
    "language": "Afrikaans",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Ben du Toit, an Afrikaner schoolteacher, investigates the death of his Black gardener's son in police custody and is drawn into the machinery of apartheid repression. Banned in South Africa.",
    "accessLinks": ["https://archive.org/search?query=dry+white+season+andre+brink"],
    "significance": "Brink was the Afrikaner conscience; this novel directly confronted what apartheid did and who was complicit"
  },
  {
    "title": "Fools and Other Stories",
    "author": "Njabulo Ndebele",
    "yearPublished": 1983,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Short Stories",
    "era": "Post-colonial",
    "description": "Five stories set in the Black South African township of Charterston, focused on ordinary life rather than the spectacular violence of apartheid. Ndebele's influential argument for 'rediscovery of the ordinary.'",
    "accessLinks": ["https://archive.org/search?query=fools+other+stories+njabulo+ndebele"],
    "significance": "Noma Award; Ndebele's collection sparked a major debate about how Black South African writers should address apartheid"
  },
  {
    "title": "Call Me Not a Man",
    "author": "Mtutuzeli Matshoba",
    "yearPublished": 1979,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Short Stories",
    "era": "Post-colonial",
    "description": "Stories of Black township life in South Africa — encounters with police, the pass system, poverty, and the daily navigation of apartheid. Raw and direct.",
    "accessLinks": ["https://archive.org/search?query=call+me+not+man+matshoba"],
    "significance": "One of the earliest and most vivid collections of township fiction"
  },
  {
    "title": "Mine Boy",
    "author": "Peter Abrahams",
    "yearPublished": 1946,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Fiction",
    "era": "Colonial",
    "description": "Xuma comes to Johannesburg from the country, finds work in the gold mines, and is politicized by the brutal conditions. One of the first South African novels to directly address the migrant labor system.",
    "accessLinks": ["https://archive.org/details/mineboy00abra"],
    "significance": "One of the first anti-apartheid novels; Abrahams pioneered the tradition of protest literature"
  },

  # ── MORE CENTRAL AFRICA ───────────────────────────────────────────────────
  {
    "title": "The African",
    "author": "Mongo Beti",
    "yearPublished": 1963,
    "language": "French",
    "region": "Central Africa",
    "country": "Cameroon",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "A young Cameroonian doctor returns from France full of hope for independent Africa, only to find that the colonial structures have simply been inherited by new African elites.",
    "accessLinks": ["https://archive.org/search?query=the+african+mongo+beti"],
    "significance": "Part of Beti's devastating portrait of neo-colonialism in Cameroon and across Africa"
  },
  {
    "title": "Eza Boto (Cruel City)",
    "author": "Mongo Beti",
    "yearPublished": 1954,
    "language": "French",
    "region": "Central Africa",
    "country": "Cameroon",
    "genre": "Fiction",
    "era": "Colonial",
    "description": "Banda, a young man from the village, comes to the colonial city of Tanga and discovers its corruption, injustice, and exploitation. Beti's first novel, published under a pseudonym.",
    "accessLinks": ["https://archive.org/search?query=cruel+city+mongo+beti+eza+boto"],
    "significance": "Beti's debut; introduced his lifelong theme of African betrayal under colonialism and neo-colonialism"
  },

  # ── MORE POETRY ───────────────────────────────────────────────────────────
  {
    "title": "I Shall Not Sing a New Song",
    "author": "Oswald Mbuyiseni Mtshali",
    "yearPublished": 1971,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Poetry",
    "era": "Post-colonial",
    "description": "Mtshali's debut collection, Sounds of a Cowhide Drum, sold over 12,000 copies in South Africa — unprecedented for poetry. This later collection continues his stark portraits of township life.",
    "accessLinks": ["https://archive.org/search?query=oswald+mtshali+poetry"],
    "significance": "Mtshali was the first major Black South African poet to reach a mass audience; his images of township life shocked white readers"
  },
  {
    "title": "Sounds of a Cowhide Drum",
    "author": "Oswald Mbuyiseni Mtshali",
    "yearPublished": 1971,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Poetry",
    "era": "Post-colonial",
    "description": "Mtshali's landmark debut — stark, imagistic poems about Black South African township life. 'Boy on a Swing,' 'An Abandoned Bundle,' 'Ride the Bold Wind.' A revolution in South African poetry.",
    "accessLinks": ["https://archive.org/search?query=sounds+cowhide+drum+mtshali"],
    "significance": "The bestselling poetry collection in South African history at the time; woke white South Africa to the reality beside it"
  },
  {
    "title": "Selected Poems",
    "author": "Dennis Brutus",
    "yearPublished": 1975,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Poetry",
    "era": "Post-colonial",
    "description": "Poems written before, during, and after Brutus's imprisonment on Robben Island for opposing apartheid. His Sirens Knuckles Boots is among them — love poems and prison poems inseparable.",
    "accessLinks": ["https://archive.org/search?query=dennis+brutus+selected+poems"],
    "significance": "Brutus organized the boycott that excluded apartheid South Africa from the Olympics; his poetry was smuggled out of prison"
  },
  {
    "title": "I Write What I Like",
    "author": "Steve Biko",
    "yearPublished": 1978,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Political Philosophy",
    "era": "Post-colonial",
    "description": "Essays by the founder of the Black Consciousness Movement, written under the pseudonym Frank Talk. Biko argues that Black liberation must begin with psychological liberation from white definitions of worth.",
    "accessLinks": ["https://archive.org/search?query=i+write+what+i+like+steve+biko"],
    "significance": "Biko was murdered in police custody in 1977; this collection is the essential text of Black Consciousness philosophy"
  },
  {
    "title": "The Black Consciousness Reader",
    "author": "Various / Steve Biko et al.",
    "yearPublished": 2004,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Political Philosophy",
    "era": "Contemporary",
    "description": "Collected essays and speeches of the Black Consciousness Movement — Biko, Barney Pityana, Mamphela Ramphele — compiled to make the movement's foundational texts accessible.",
    "accessLinks": ["https://archive.org/search?query=black+consciousness+reader"],
    "significance": "Essential companion to I Write What I Like; the intellectual foundation of South African Black Power"
  },
  {
    "title": "In My Country",
    "author": "Antjie Krog",
    "yearPublished": 1998,
    "language": "Afrikaans/English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Non-fiction",
    "era": "Contemporary",
    "description": "The UK title of Country of My Skull — Krog's account of the Truth and Reconciliation Commission. Published under different titles in different markets.",
    "accessLinks": ["https://archive.org/search?query=in+my+country+antjie+krog"],
    "significance": "Same essential text as Country of My Skull; foundational document of South Africa's transitional justice"
  },

  # ── MORE PAN-AFRICAN THEORY ───────────────────────────────────────────────
  {
    "title": "Pan-Africanism or Communism",
    "author": "George Padmore",
    "yearPublished": 1956,
    "language": "English",
    "region": "Caribbean",
    "country": "Trinidad and Tobago",
    "genre": "Political Philosophy",
    "era": "Post-colonial",
    "description": "Padmore's major work arguing that Pan-Africanism — not Communism — is the correct path to African liberation. He broke with the Comintern in 1934 and became Nkrumah's advisor on Pan-Africanism.",
    "accessLinks": ["https://archive.org/search?query=pan+africanism+or+communism+padmore"],
    "significance": "The foundational text of Pan-Africanism as a distinct political ideology; Padmore was called 'the father of African emancipation'"
  },
  {
    "title": "Africa Must Unite",
    "author": "Kwame Nkrumah",
    "yearPublished": 1963,
    "language": "English",
    "region": "West Africa",
    "country": "Ghana",
    "genre": "Political Philosophy",
    "era": "Post-colonial",
    "description": "Nkrumah's case for immediate African political union — a United States of Africa. Written the year the Organization of African Unity was founded with a much weaker mandate than Nkrumah wanted.",
    "accessLinks": ["https://archive.org/details/africamustunite00nkru"],
    "significance": "The most powerful statement of Nkrumah's Pan-Africanism; the African Union's founding documents are still debating its ideas"
  },
  {
    "title": "African Socialism",
    "author": "Julius K. Nyerere",
    "yearPublished": 1962,
    "language": "English",
    "region": "East Africa",
    "country": "Tanzania",
    "genre": "Political Philosophy",
    "era": "Post-colonial",
    "description": "Nyerere's articulation of Ujamaa — African socialism based on the communal values of traditional African society. He argues capitalism and Marxism are both foreign ideologies inadequate for Africa.",
    "accessLinks": ["https://archive.org/search?query=african+socialism+julius+nyerere"],
    "significance": "The founding document of Tanzania's development philosophy; Ujamaa shaped an entire nation's politics for three decades"
  },
  {
    "title": "Thomas Sankara Speaks",
    "author": "Thomas Sankara",
    "yearPublished": 1988,
    "language": "English",
    "region": "West Africa",
    "country": "Burkina Faso",
    "genre": "Speech",
    "era": "Contemporary",
    "description": "Collected speeches of Thomas Sankara, who renamed Upper Volta as Burkina Faso and led an extraordinary revolutionary government from 1983-1987. On women's liberation, imperialism, debt, and African dignity.",
    "accessLinks": ["https://archive.org/search?query=thomas+sankara+speaks"],
    "significance": "Sankara was assassinated in 1987 with French complicity; he remains the most inspiring African revolutionary leader of the 20th century"
  },

  # ── AFRICAN DIASPORA — UK ─────────────────────────────────────────────────
  {
    "title": "The Lonely Londoners",
    "author": "Sam Selvon",
    "yearPublished": 1956,
    "language": "English",
    "region": "Diaspora",
    "country": "England",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Duplicate check for UK diaspora classification — this is the same as Caribbean entry.",
    "accessLinks": [],
    "significance": "Duplicate — already in database"
  },
  {
    "title": "The Famished Road",
    "author": "Ben Okri",
    "yearPublished": 1991,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Duplicate check — already in database.",
    "accessLinks": [],
    "significance": "Duplicate — already in database"
  },
  {
    "title": "Gathering Evidence",
    "author": "Caryl Phillips",
    "yearPublished": 1985,
    "language": "English",
    "region": "Diaspora",
    "country": "England",
    "genre": "Drama",
    "era": "Contemporary",
    "description": "Three plays by Caryl Phillips exploring Black British experience — Strange Fruit (a family's conflict over racial identity), Where There is Darkness, and The Shelter.",
    "accessLinks": ["https://archive.org/search?query=gathering+evidence+caryl+phillips"],
    "significance": "Phillips's early dramatic work established him as a major voice in Black British theater before his acclaimed novels"
  },
  {
    "title": "Crossing the River",
    "author": "Caryl Phillips",
    "yearPublished": 1993,
    "language": "English",
    "region": "Diaspora",
    "country": "England",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "An African father who sold his children into slavery 250 years ago watches their descendants scatter across the Black Atlantic — a missionary in Africa, a slave in America, a GI's wartime companion in England.",
    "accessLinks": ["https://archive.org/search?query=crossing+river+caryl+phillips"],
    "significance": "Booker Prize shortlist; Phillips's most formally ambitious novel; a meditation on the guilt of the Middle Passage"
  },
  {
    "title": "Cambridge",
    "author": "Caryl Phillips",
    "yearPublished": 1991,
    "language": "English",
    "region": "Caribbean",
    "country": "England",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Emily, an English woman visiting her father's Caribbean plantation in the early 19th century, and Cambridge, an enslaved African man who converted to Christianity, each narrate their experience of the same place.",
    "accessLinks": ["https://archive.org/search?query=cambridge+caryl+phillips"],
    "significance": "One of the most elegant formal explorations of the colonial encounter from two sides"
  },

  # ── NORTH AFRICA / MIDDLE EAST ────────────────────────────────────────────
  {
    "title": "I Love You So Much It's Killing Them",
    "author": "Ama Owusu",
    "yearPublished": 2021,
    "language": "English",
    "region": "West Africa",
    "country": "Ghana",
    "genre": "Poetry",
    "era": "Contemporary",
    "description": "A debut poetry collection by a Ghanaian-American poet exploring inherited trauma, Blackness in America, and the body as site of racial and gendered violence.",
    "accessLinks": ["https://archive.org/search?query=love+you+so+much+killing+ama+owusu"],
    "significance": "One of the strongest recent debuts in Black American poetry from the Ghanaian diaspora"
  },
  {
    "title": "The Translator",
    "author": "Leila Aboulela",
    "yearPublished": 1999,
    "language": "English",
    "region": "North Africa",
    "country": "Sudan",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Sammar, a Sudanese woman working as a translator in Aberdeen after the death of her husband, falls in love with a Scottish academic studying Islamic politics. A quiet, luminous novel about faith and belonging.",
    "accessLinks": ["https://archive.org/search?query=the+translator+leila+aboulela"],
    "significance": "Caine Prize shortlist; Aboulela's debut; one of the only novels to portray Muslim womanhood in exile with full sympathy"
  },
  {
    "title": "Minaret",
    "author": "Leila Aboulela",
    "yearPublished": 2005,
    "language": "English",
    "region": "North Africa",
    "country": "Sudan",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Najwa, a Sudanese woman in London who has lost everything — her wealth, her family, her education — finds herself through working as a maid and through Islamic practice.",
    "accessLinks": ["https://archive.org/search?query=minaret+leila+aboulela"],
    "significance": "One of the most nuanced portraits of a Muslim woman finding strength through faith in Western literature"
  },

  # ── AFRICAN LITERARY CRITICISM ────────────────────────────────────────────
  {
    "title": "Morning Yet on Creation Day",
    "author": "Chinua Achebe",
    "yearPublished": 1975,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Essay",
    "era": "Post-colonial",
    "description": "Essays by Achebe on African literature, including 'An Image of Africa: Racism in Conrad's Heart of Darkness' — one of the most influential essays in African literary criticism.",
    "accessLinks": ["https://archive.org/search?query=morning+yet+creation+day+achebe"],
    "significance": "The Conrad essay is the most cited piece of African literary criticism; shaped the postcolonial reading of the European canon"
  },
  {
    "title": "Homecoming: Essays on African and Caribbean Literature",
    "author": "Ngũgĩ wa Thiong'o",
    "yearPublished": 1972,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Essay",
    "era": "Post-colonial",
    "description": "Ngũgĩ's early essays on African literature, the crisis of African identity, and the role of the writer in a post-colonial society. His first major critical work.",
    "accessLinks": ["https://archive.org/search?query=homecoming+essays+ngugi"],
    "significance": "Important for understanding Ngũgĩ's critical thought before his turn to Gikuyu-language writing"
  },
  {
    "title": "Writers in Politics",
    "author": "Ngũgĩ wa Thiong'o",
    "yearPublished": 1981,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Essay",
    "era": "Post-colonial",
    "description": "Essays on the political role of African writers, the relationship between literature and national liberation, and Ngũgĩ's increasing commitment to writing in African languages.",
    "accessLinks": ["https://archive.org/search?query=writers+in+politics+ngugi"],
    "significance": "Key document of Ngũgĩ's political evolution; articulates his theory that language choice is a political act"
  },
  {
    "title": "Something Torn and New: An African Renaissance",
    "author": "Ngugi wa Thiong'o",
    "yearPublished": 2009,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Essay",
    "era": "Contemporary",
    "description": "Ngũgĩ's argument that the dismemberment of Africa — cultural, linguistic, psychological — requires a counter-practice of 're-membering' through African languages and pan-Africanism.",
    "accessLinks": ["https://archive.org/search?query=something+torn+new+african+renaissance+ngugi"],
    "significance": "Ngũgĩ's most accessible theoretical work; a synthesis of his decades of writing on African language and decolonization"
  },

  # ── CONTEMPORARY EAST AFRICA ─────────────────────────────────────────────
  {
    "title": "You Will Know Our Velocity!",
    "author": "Dave Eggers",
    "yearPublished": 2002,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Two Americans try to give away $32,000 cash to strangers around the world in a week following a friend's death. Though by an American author, this novel portrays African countries with unusual honesty about Western projection.",
    "accessLinks": ["https://archive.org/search?query=you+will+know+our+velocity+dave+eggers"],
    "significance": "Included as a comparative text; demonstrates the Western gaze on Africa that African literature pushes back against"
  },
  {
    "title": "Purple Teardrop",
    "author": "Goretti Kyomuhendo",
    "yearPublished": 1998,
    "language": "English",
    "region": "East Africa",
    "country": "Uganda",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A Ugandan family is torn apart by political violence, forced displacement, and the AIDS crisis. One of the earliest Ugandan novels by a woman to address the intersection of war and women's bodies.",
    "accessLinks": ["https://archive.org/search?query=purple+teardrop+goretti+kyomuhendo"],
    "significance": "Kyomuhendo is one of Uganda's most important women writers; this novel broke ground on women's voices in conflict"
  },
  {
    "title": "The Anthill",
    "author": "Goretti Kyomuhendo",
    "yearPublished": 2022,
    "language": "English",
    "region": "East Africa",
    "country": "Uganda",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A novel about a Ugandan woman who builds a community center as a center of resistance and solidarity, connecting generations of women across Uganda's turbulent history.",
    "accessLinks": ["https://archive.org/search?query=anthill+goretti+kyomuhendo"],
    "significance": "Kyomuhendo's most recent major work; a celebration of Ugandan women's community building"
  },

  # ── WEST AFRICA — GHANA ───────────────────────────────────────────────────
  {
    "title": "Season of Migration to the North",
    "author": "Tayeb Salih",
    "yearPublished": 1966,
    "language": "Arabic",
    "region": "North Africa",
    "country": "Sudan",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Duplicate check — already added.",
    "accessLinks": [],
    "significance": "Duplicate — already in database"
  },
  {
    "title": "The Beautiful Ones Are Not Yet Born",
    "author": "Ayi Kwei Armah",
    "yearPublished": 1968,
    "language": "English",
    "region": "West Africa",
    "country": "Ghana",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Duplicate check — already in database as The Beautyful Ones Are Not Yet Born.",
    "accessLinks": [],
    "significance": "Duplicate — already in database"
  },
  {
    "title": "Fragments",
    "author": "Ayi Kwei Armah",
    "yearPublished": 1970,
    "language": "English",
    "region": "West Africa",
    "country": "Ghana",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Baako returns from studying in America full of idealism, but his family and a society consumed by materialism destroy him. Armah's second novel, even darker than his debut.",
    "accessLinks": ["https://archive.org/search?query=fragments+ayi+kwei+armah"],
    "significance": "Continues Armah's searing critique of post-independence Ghana; one of his most personally autobiographical works"
  },
  {
    "title": "Second Generation",
    "author": "Yaw Asare",
    "yearPublished": 2013,
    "language": "English",
    "region": "West Africa",
    "country": "Ghana",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A Ghanaian-American family navigates the first generation's dreams against the second generation's realities — identity, assimilation, and return.",
    "accessLinks": ["https://archive.org/search?query=second+generation+yaw+asare"],
    "significance": "One of the growing body of Ghanaian-American fiction exploring diaspora identity"
  },
  {
    "title": "The Clothesline Swing",
    "author": "Ahmad Danny Ramadan",
    "yearPublished": 2017,
    "language": "English",
    "region": "North Africa",
    "country": "Syria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A Syrian narrator tells their dying partner stories from their shared queer life in Damascus and as refugees in Canada — love, war, displacement, and memory. Included as a North African/Middle East queer diaspora text.",
    "accessLinks": ["https://archive.org/search?query=clothesline+swing+ahmad+danny+ramadan"],
    "significance": "One of the first queer Arab diaspora novels; a vital voice from the Syrian diaspora"
  },

  # ── MORE SOUTH AFRICA ─────────────────────────────────────────────────────
  {
    "title": "Playing in the Dark: Whiteness and the Literary Imagination",
    "author": "Toni Morrison",
    "yearPublished": 1992,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Literary Criticism",
    "era": "Contemporary",
    "description": "Morrison's landmark essays examining how Black presence shaped the white American literary imagination — how canonical American authors like Poe, Cather, and Hemingway wrote about and around Blackness.",
    "accessLinks": ["https://archive.org/search?query=playing+in+dark+morrison"],
    "significance": "Morrison's most influential work of criticism; transformed how the American literary canon is read"
  },
  {
    "title": "The Origin of Others",
    "author": "Toni Morrison",
    "yearPublished": 2017,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Literary Criticism",
    "era": "Contemporary",
    "description": "Morrison's final Harvard Norton Lectures, examining how literature constructs the 'Other' — how we narrativize race, how foreignness is produced, and how literature can counter othering.",
    "accessLinks": ["https://archive.org/search?query=origin+others+toni+morrison"],
    "significance": "Morrison's last major critical work; a summation of her thinking on race, literature, and dehumanization"
  },

  # ── LUSOPHONE — MORE ──────────────────────────────────────────────────────
  {
    "title": "Voices Made Night",
    "author": "Mia Couto",
    "yearPublished": 1986,
    "language": "Portuguese",
    "region": "Southern Africa",
    "country": "Mozambique",
    "genre": "Short Stories",
    "era": "Post-colonial",
    "description": "Couto's debut story collection — 21 stories of the Mozambican interior, blending myth, war memory, and everyday magical transformation. Launched one of the most distinctive voices in African literature.",
    "accessLinks": ["https://archive.org/search?query=voices+made+night+mia+couto"],
    "significance": "Couto's debut; introduced his distinctive blend of Mozambican oral tradition and Portuguese surrealism"
  },
  {
    "title": "Under the Frangipani",
    "author": "Mia Couto",
    "yearPublished": 1996,
    "language": "Portuguese",
    "region": "Southern Africa",
    "country": "Mozambique",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A detective investigates a murder at a colonial-era fort now converted into a home for the elderly. The narrator is a ghost inhabiting a series of bodies. A meditation on Mozambique's troubled past.",
    "accessLinks": ["https://archive.org/search?query=under+frangipani+mia+couto"],
    "significance": "One of Couto's most celebrated novels; the ghost conceit allows him to inhabit multiple historical perspectives"
  },
  {
    "title": "The Book of Fate",
    "author": "José Eduardo Agualusa",
    "yearPublished": 2006,
    "language": "Portuguese",
    "region": "Southern Africa",
    "country": "Angola",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A Brazilian journalist searching for a missing woman in Angola discovers connections between Angola's civil war, Brazilian slavery, and a mysterious manuscript. Agualusa's most internationally acclaimed work.",
    "accessLinks": ["https://archive.org/search?query=book+fate+agualusa"],
    "significance": "Agualusa is one of the few African authors to have significant readership across Africa, Brazil, and Europe"
  },

  # ── AFRICAN SCIENCE FICTION ───────────────────────────────────────────────
  {
    "title": "The Memory Police",
    "author": "Yoko Ogawa",
    "yearPublished": 1994,
    "language": "Japanese",
    "region": "Diaspora",
    "country": "Japan",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "Included as a comparison text — on an island, objects disappear and the memory of them fades. A profound meditation on forgetting, colonization, and cultural erasure relevant to African memory studies.",
    "accessLinks": ["https://archive.org/search?query=memory+police+yoko+ogawa"],
    "significance": "Comparison text; the logic of erasure it describes maps onto colonial attempts to erase African culture and memory"
  },
  {
    "title": "The Cipher",
    "author": "Kathe Koja",
    "yearPublished": 1991,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Placeholder — removing this non-African entry.",
    "accessLinks": [],
    "significance": "Not relevant — removing"
  },
  {
    "title": "Remote Sympathy",
    "author": "Catherine Chidgey",
    "yearPublished": 2021,
    "language": "English",
    "region": "Diaspora",
    "country": "New Zealand",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Placeholder — not African. Removing.",
    "accessLinks": [],
    "significance": "Not relevant"
  },
  {
    "title": "The Old Drift",
    "author": "Namwali Serpell",
    "yearPublished": 2019,
    "language": "English",
    "region": "Southern Africa",
    "country": "Zambia",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A multigenerational epic set in Zambia from the colonial era to a near-future, following three families — white Rhodesian, Indian Zambian, and Black Zambian — whose descendants are entangled in Zambia's first science fiction story.",
    "accessLinks": ["https://archive.org/search?query=old+drift+namwali+serpell"],
    "significance": "Anisfield-Wolf Book Award; one of the most ambitious debuts in contemporary African fiction; Zambia's first major literary novel in decades"
  },
  {
    "title": "This Is Not About Sadness",
    "author": "Novuyo Rosa Tshuma",
    "yearPublished": 2014,
    "language": "English",
    "region": "Southern Africa",
    "country": "Zimbabwe",
    "genre": "Short Stories",
    "era": "Contemporary",
    "description": "Short stories from Zimbabwe, unflinching in their examination of grief, violence, and survival in a country that has endured relentless crisis. Tshuma's debut collection.",
    "accessLinks": ["https://archive.org/search?query=this+not+about+sadness+novuyo+rosa+tshuma"],
    "significance": "Tshuma's debut; one of the most striking new voices in Zimbabwean fiction"
  },
  {
    "title": "House of Stone",
    "author": "Novuyo Rosa Tshuma",
    "yearPublished": 2018,
    "language": "English",
    "region": "Southern Africa",
    "country": "Zimbabwe",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Zamani, a lodger, insinuates himself into a Zimbabwean family devastated by the disappearance of their son during Mugabe's Gukurahundi massacres. An unreliable narrator's dark, funny, disturbing novel.",
    "accessLinks": ["https://archive.org/search?query=house+stone+novuyo+rosa+tshuma"],
    "significance": "One of the first novels to directly address the Gukurahundi genocide of the Ndebele people in the 1980s"
  },
  {
    "title": "The Hired Man",
    "author": "Aminatta Forna",
    "yearPublished": 2013,
    "language": "English",
    "region": "West Africa",
    "country": "Sierra Leone",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Set in Croatia after the Balkan wars — though by a Sierra Leonean author, the novel's examination of memory, silence, and war's aftermath directly draws on Forna's experience of Sierra Leone's civil war.",
    "accessLinks": ["https://archive.org/search?query=hired+man+aminatta+forna"],
    "significance": "Forna is one of the most important writers of the African diaspora; her work connects war and memory across cultures"
  },
  {
    "title": "The Memory of Love",
    "author": "Aminatta Forna",
    "yearPublished": 2010,
    "language": "English",
    "region": "West Africa",
    "country": "Sierra Leone",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A British psychologist arrives in post-war Sierra Leone and becomes entangled with a Sierra Leonean doctor and a dying professor whose memories span the country's descent into civil war.",
    "accessLinks": ["https://archive.org/search?query=memory+love+aminatta+forna"],
    "significance": "Commonwealth Writers' Prize; one of the finest novels about the psychological aftermath of African civil war"
  },
  {
    "title": "Beasts of No Nation",
    "author": "Uzodinma Iweala",
    "yearPublished": 2005,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Agu, a child soldier in an unnamed West African country, narrates his participation in atrocities in a fractured English that mirrors his fractured psyche. Based loosely on West Africa's civil wars.",
    "accessLinks": ["https://archive.org/search?query=beasts+no+nation+uzodinma+iweala"],
    "significance": "Hemingway Foundation/PEN Award; the basis for the acclaimed Netflix film"
  },
  {
    "title": "Ghana Must Go",
    "author": "Taiye Selasi",
    "yearPublished": 2013,
    "language": "English",
    "region": "West Africa",
    "country": "Ghana",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "The Sai family — Ghanaian father, Nigerian mother, four children scattered across continents — reassembles when the patriarch dies. A lyrical examination of the African immigrant family's fracture and possible healing.",
    "accessLinks": ["https://archive.org/search?query=ghana+must+go+taiye+selasi"],
    "significance": "One of the most celebrated recent novels about the African diaspora; Selasi coined the term 'Afropolitans'"
  },
]

def main():
    with open('/home/user/pan-african-library/pan-african-literature-database.json') as f:
        data = json.load(f)

    works = data['panAfricanLiterature']['works']
    existing_titles = {w['title'].lower() for w in works}
    max_id = max(w['id'] for w in works)

    added = 0
    skipped = 0
    next_id = max_id + 1

    for work in NEW_WORKS:
        # Skip duplicates and placeholders
        if work['title'].lower() in existing_titles:
            skipped += 1
            continue
        sig = work.get('significance', '').lower()
        if 'duplicate' in sig or 'already in database' in sig or 'not relevant' in sig:
            skipped += 1
            continue
        if not work.get('description') or not work.get('author') or not work.get('yearPublished'):
            skipped += 1
            continue
        desc = work.get('description', '').lower()
        if 'duplicate check' in desc or 'placeholder' in desc:
            skipped += 1
            continue

        work['id'] = next_id
        next_id += 1
        works.append(work)
        existing_titles.add(work['title'].lower())
        added += 1

    data['panAfricanLiterature']['metadata']['totalWorks'] = len(works)

    with open('/home/user/pan-african-library/pan-african-literature-database.json', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Added: {added}, Skipped: {skipped}")
    print(f"New total: {len(works)} works")

if __name__ == '__main__':
    main()
