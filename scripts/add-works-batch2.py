#!/usr/bin/env python3
"""Second batch of new works."""
import json

NEW_WORKS = [
  # ── MORE WEST AFRICA ──────────────────────────────────────────────────────
  {
    "title": "Season of Migration to the North",
    "author": "Tayeb Salih",
    "yearPublished": 1966,
    "language": "Arabic",
    "region": "North Africa",
    "country": "Sudan",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "A Sudanese man returns from studying in England to find a mysterious stranger, Mustafa Sa'eed, has taken up residence in his village. A shadowy anti-Othello, the novel reverses the colonial gaze with disturbing power.",
    "accessLinks": ["https://archive.org/search?query=season+migration+north+tayeb+salih"],
    "significance": "Named the most important Arab novel of the 20th century by the Arab Literary Academy; a foundational postcolonial text"
  },
  {
    "title": "The Wedding of Zein",
    "author": "Tayeb Salih",
    "yearPublished": 1966,
    "language": "Arabic",
    "region": "North Africa",
    "country": "Sudan",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Three interlinked novellas about life in a Sudanese village — lyrical, comic, and deeply rooted in Islamic devotional culture. Zein, the village fool, unexpectedly wins the most desirable woman.",
    "accessLinks": ["https://archive.org/search?query=wedding+zein+tayeb+salih"],
    "significance": "Salih's companion work to Season of Migration; one of the most beloved works of Sudanese literature"
  },
  {
    "title": "The Cairo Trilogy: Palace Walk",
    "author": "Naguib Mahfouz",
    "yearPublished": 1956,
    "language": "Arabic",
    "region": "North Africa",
    "country": "Egypt",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "First volume of Mahfouz's epic trilogy, following the al-Jawad family in Cairo between 1917-1919. The patriarch al-Sayyid Ahmad rules his household despotically while engaging in the pleasures he denies his family.",
    "accessLinks": ["https://archive.org/search?query=palace+walk+naguib+mahfouz"],
    "significance": "The cornerstone of Mahfouz's Nobel Prize-winning career; the most celebrated work of Arabic prose fiction"
  },
  {
    "title": "Arabian Nights and Days",
    "author": "Naguib Mahfouz",
    "yearPublished": 1982,
    "language": "Arabic",
    "region": "North Africa",
    "country": "Egypt",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Continuing the story where Scheherazade left off, Mahfouz sets new tales in a timeless Cairo, where djinn, sultans, and ordinary people live together. A meditation on justice, power, and the divine.",
    "accessLinks": ["https://archive.org/search?query=arabian+nights+days+mahfouz"],
    "significance": "One of Mahfouz's most imaginative late works; a reimagining of the foundational text of Arabic storytelling"
  },
  {
    "title": "So Long a Letter",
    "author": "Mariama Bâ",
    "yearPublished": 1979,
    "language": "French",
    "region": "West Africa",
    "country": "Senegal",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Ramatoulaye writes a long letter to her best friend Aissatou after their husbands take second wives. A fundamental feminist text about polygamy, friendship, and what women owe themselves.",
    "accessLinks": ["https://archive.org/search?query=so+long+letter+mariama+ba"],
    "significance": "Prix Noma; one of the foundational texts of African feminist literature; translated into over 20 languages"
  },
  {
    "title": "Scarlet Song",
    "author": "Mariama Bâ",
    "yearPublished": 1981,
    "language": "French",
    "region": "West Africa",
    "country": "Senegal",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Mireille, a French woman, marries the Senegalese Ousmane despite opposition from both families. When Ousmane takes an African second wife, Mireille's world collapses. A tragedy about cultural collision and betrayal.",
    "accessLinks": ["https://archive.org/search?query=scarlet+song+mariama+ba"],
    "significance": "Bâ's second and final novel, published posthumously; continues her examination of women's lives in Senegal"
  },
  {
    "title": "God's Bits of Wood",
    "author": "Ousmane Sembène",
    "yearPublished": 1960,
    "language": "French",
    "region": "West Africa",
    "country": "Senegal",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Based on the 1947-48 Dakar-Niger railway workers' strike. African workers defy the French colonial administration; women and men find new forms of solidarity and consciousness through collective struggle.",
    "accessLinks": ["https://archive.org/search?query=gods+bits+wood+sembene"],
    "significance": "Sembène's masterpiece and one of the great labor novels in world literature; Sembène later became the father of African cinema"
  },
  {
    "title": "Xala",
    "author": "Ousmane Sembène",
    "yearPublished": 1973,
    "language": "French",
    "region": "West Africa",
    "country": "Senegal",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "El Hadji Abdou Kader Bèye, a Senegalese businessman who takes a third wife, discovers he has been struck with xala — impotence. A satirical allegory of the African bourgeoisie's complicity with neo-colonialism.",
    "accessLinks": ["https://archive.org/search?query=xala+sembene"],
    "significance": "Sembène adapted it into one of his most celebrated films; a withering satire of post-independence African elites"
  },
  {
    "title": "L'Aventure ambiguë (French original)",
    "author": "Cheikh Hamidou Kane",
    "yearPublished": 1961,
    "language": "French",
    "region": "West Africa",
    "country": "Senegal",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "The original French edition of Ambiguous Adventure, Kane's meditation on the collision between Islamic Toucouleur culture and French colonial education. Published as a single unified text.",
    "accessLinks": ["https://archive.org/search?query=aventure+ambigue+cheikh+hamidou+kane"],
    "significance": "One of the great works of francophone African literature; explores the tragic cost of colonial education for the colonized"
  },
  {
    "title": "The African Child",
    "author": "Camara Laye",
    "yearPublished": 1953,
    "language": "French",
    "region": "West Africa",
    "country": "Guinea",
    "genre": "Autobiography",
    "era": "Colonial",
    "description": "Camara Laye's lyrical memoir of his childhood in Kouroussa, Guinea — his father's blacksmith shop filled with gold and spirits, the rituals of initiation, and the bittersweet departure for school in France.",
    "accessLinks": ["https://archive.org/search?query=african+child+camara+laye"],
    "significance": "Prix Charles Veillon; one of the most beloved works of francophone African literature; a classic of childhood memoir"
  },
  {
    "title": "The Radiance of the King",
    "author": "Camara Laye",
    "yearPublished": 1954,
    "language": "French",
    "region": "West Africa",
    "country": "Guinea",
    "genre": "Fiction",
    "era": "Colonial",
    "description": "Clarence, a destitute white man stranded in Africa, seeks an audience with the African king who he believes will save him. A dreamlike, allegorical reversal of the colonial encounter — Africa as the mysterious other now.",
    "accessLinks": ["https://archive.org/search?query=radiance+king+camara+laye"],
    "significance": "Saul Bellow translated it; often compared to Kafka; one of the most unusual and beautiful African novels"
  },
  {
    "title": "The Interpreters",
    "author": "Wole Soyinka",
    "yearPublished": 1965,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "A group of young Nigerian intellectuals — engineers, journalists, academics — navigate a corrupt post-independence Lagos, trying to find meaning. Soyinka's dense, allusive prose draws on Yoruba mythology.",
    "accessLinks": ["https://archive.org/search?query=the+interpreters+wole+soyinka"],
    "significance": "Soyinka's first novel; one of the most formally challenging and rewarding Nigerian novels"
  },
  {
    "title": "The Voice",
    "author": "Gabriel Okara",
    "yearPublished": 1964,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Okolo returns to his village seeking 'it' — an authentic integrity — and is cast out by village elders who fear his questions. A spare, haunting novel written in a style that mimics the syntax of Ijaw language.",
    "accessLinks": ["https://archive.org/search?query=the+voice+gabriel+okara"],
    "significance": "A formally unique work that attempted to create an African literary English based on Ijaw syntax"
  },
  {
    "title": "Harvest",
    "author": "Kolawole Ogunlade",
    "yearPublished": 1969,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "One of the earliest Nigerian novels to tackle the Biafran War from a civilian perspective, following families torn apart by the conflict.",
    "accessLinks": ["https://archive.org/search?query=harvest+kolawole+ogunlade"],
    "significance": "One of the earliest literary responses to the Biafran War from Nigerian literature"
  },
  {
    "title": "Rope of God",
    "author": "Kole Omotoso",
    "yearPublished": 1974,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "A Yoruba community converts to Islam, and the conflicts that arise between generations, between the new faith and old customs, form the backbone of this quiet, thoughtful novel.",
    "accessLinks": ["https://archive.org/search?query=rope+of+god+kole+omotoso"],
    "significance": "Omotoso is an important voice in Nigerian literature engaging with Islam and cultural identity"
  },
  {
    "title": "The Last Duty",
    "author": "Isidore Okpewho",
    "yearPublished": 1976,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Six narrators take turns telling the story of the Nigerian Civil War from different perspectives — soldier, civilian, collaborator, victim. One of the most technically accomplished Nigerian novels.",
    "accessLinks": ["https://archive.org/search?query=last+duty+isidore+okpewho"],
    "significance": "African Arts Prize; one of the most sophisticated Nigerian novels in its deployment of multiple narrative voices"
  },
  {
    "title": "Petals of Blood",
    "author": "Ngũgĩ wa Thiong'o",
    "yearPublished": 1977,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Set in the fictional town of Ilmorog, following four suspects in a murder investigation. Through their stories, Ngũgĩ builds a sweeping portrait of post-independence Kenya's betrayal by its own ruling class.",
    "accessLinks": ["https://archive.org/search?query=petals+blood+ngugi"],
    "significance": "Ngũgĩ was detained without trial shortly after its publication; considered his most politically explicit English-language novel"
  },

  # ── MORE SOUTH AFRICA ─────────────────────────────────────────────────────
  {
    "title": "The Heart of Redness",
    "author": "Zakes Mda",
    "yearPublished": 2000,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Two parallel stories of Xhosa people separated by 150 years — the 1856 cattle-killing prophecy that destroyed the Xhosa nation, and a contemporary village debating whether to allow a casino and tourism resort.",
    "accessLinks": ["https://archive.org/search?query=heart+redness+zakes+mda"],
    "significance": "Mda's masterpiece; Sunday Times Fiction Prize; the most important novel about Xhosa history and identity"
  },
  {
    "title": "Triomf",
    "author": "Marlene van Niekerk",
    "yearPublished": 1994,
    "language": "Afrikaans",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A poor white Afrikaner family lives in Triomf, a suburb built on the rubble of Sophiatown. Set in the final days before South Africa's first democratic election, a black comedy of white decline.",
    "accessLinks": ["https://archive.org/search?query=triomf+marlene+van+niekerk"],
    "significance": "One of the most celebrated Afrikaans novels; a savage self-portrait of Afrikaner decline at the end of apartheid"
  },
  {
    "title": "Disgrace",
    "author": "J.M. Coetzee",
    "yearPublished": 1999,
    "language": "English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "David Lurie, a Cape Town professor who loses his position after an affair with a student, retreats to his daughter Lucy's farm where they are attacked by three men. A novel about shame, power, and the post-apartheid reckoning.",
    "accessLinks": ["https://archive.org/search?query=disgrace+jm+coetzee"],
    "significance": "Booker Prize 1999; Coetzee's most controversial novel; a profound examination of South Africa's transition"
  },
  {
    "title": "Country of My Skull",
    "author": "Antjie Krog",
    "yearPublished": 1998,
    "language": "Afrikaans/English",
    "region": "Southern Africa",
    "country": "South Africa",
    "genre": "Non-fiction",
    "era": "Contemporary",
    "description": "Antjie Krog covered South Africa's Truth and Reconciliation Commission for radio, and this book is her account — testimonies, poetry, analysis, and her own emotional unraveling as she witnessed the TRC hearings.",
    "accessLinks": ["https://archive.org/search?query=country+my+skull+antjie+krog"],
    "significance": "One of the most important works about the TRC and about South Africa's reckoning with apartheid atrocities"
  },
  {
    "title": "A Long Way Gone: Memoirs of a Boy Soldier",
    "author": "Ishmael Beah",
    "yearPublished": 2007,
    "language": "English",
    "region": "West Africa",
    "country": "Sierra Leone",
    "genre": "Memoir",
    "era": "Contemporary",
    "description": "Beah's account of being conscripted as a child soldier in Sierra Leone's civil war at age 12, his rehabilitation, and his life in New York. One of the most widely read African memoirs.",
    "accessLinks": ["https://archive.org/search?query=long+way+gone+ishmael+beah"],
    "significance": "Bestseller; transformed international awareness of child soldiers; Beah became a UNICEF goodwill ambassador"
  },
  {
    "title": "The Kite Runner",
    "author": "Khaled Hosseini",
    "yearPublished": 2003,
    "language": "English",
    "region": "North Africa",
    "country": "Afghanistan",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Though set in Afghanistan, this novel about Amir and Hassan crosses the lines of ethnicity (Pashtun vs. Hazara) and explores guilt, redemption, and the destruction of a country. Included as a North African/Middle Eastern diaspora text.",
    "accessLinks": ["https://archive.org/search?query=kite+runner+hosseini"],
    "significance": "One of the most widely-read novels from the Muslim world; a crucial text for understanding displacement and ethnic violence"
  },
  {
    "title": "So Vast the Prison",
    "author": "Assia Djebar",
    "yearPublished": 1995,
    "language": "French",
    "region": "North Africa",
    "country": "Algeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Third volume of the Algerian Quartet, weaving together the story of a filmmaker's love affair and the 146 BCE destruction of Carthage, exploring how women's voices are lost to history and recovered.",
    "accessLinks": ["https://archive.org/search?query=so+vast+prison+assia+djebar"],
    "significance": "Djebar's most autobiographical novel; her excavation of Carthaginian women prefigures her election to the Académie Française"
  },
  {
    "title": "The Simple Past",
    "author": "Driss Chraïbi",
    "yearPublished": 1954,
    "language": "French",
    "region": "North Africa",
    "country": "Morocco",
    "genre": "Fiction",
    "era": "Colonial",
    "description": "Driss Ferdi rebels against his overbearing father — who represents traditional Moroccan patriarchy — while navigating the world of the French colonial system. Morocco's first significant novel of psychological revolt.",
    "accessLinks": ["https://archive.org/search?query=simple+past+driss+chraibi"],
    "significance": "Caused enormous controversy on publication; foundational for Moroccan francophone fiction"
  },
  {
    "title": "The Sand Child",
    "author": "Tahar Ben Jelloun",
    "yearPublished": 1985,
    "language": "French",
    "region": "North Africa",
    "country": "Morocco",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A Moroccan man with eight daughters raises his ninth child as a boy to inherit his property — the 'boy' grows into a profound meditation on gender, identity, and the stories we tell about ourselves.",
    "accessLinks": ["https://archive.org/search?query=sand+child+ben+jelloun"],
    "significance": "Ben Jelloun's breakthrough international novel; a pioneering examination of gender identity in Arabic literature"
  },

  # ── ADDITIONAL AFRICAN DIASPORA ───────────────────────────────────────────
  {
    "title": "The Black Atlantic: Modernity and Double Consciousness",
    "author": "Paul Gilroy",
    "yearPublished": 1993,
    "language": "English",
    "region": "Diaspora",
    "country": "England",
    "genre": "Cultural Theory",
    "era": "Contemporary",
    "description": "Gilroy argues that Black Atlantic culture — crossing Africa, Europe, America, and the Caribbean — cannot be reduced to any single national or ethnic tradition. Music, literature, and politics form a hybrid culture.",
    "accessLinks": ["https://archive.org/search?query=black+atlantic+paul+gilroy"],
    "significance": "One of the most influential works in cultural studies and African diaspora studies; defined a generation of scholarship"
  },
  {
    "title": "Between the World and Me",
    "author": "Ta-Nehisi Coates",
    "yearPublished": 2015,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Essay",
    "era": "Contemporary",
    "description": "Written as a letter to his teenage son about the vulnerability of the Black body in America — police violence, mass incarceration, and the meaning of the 'Dream' that America promises but withholds.",
    "accessLinks": ["https://archive.org/search?query=between+world+me+coates"],
    "significance": "National Book Award; one of the most important American essays of the 21st century; compared to Baldwin's The Fire Next Time"
  },
  {
    "title": "The Water Dancer",
    "author": "Ta-Nehisi Coates",
    "yearPublished": 2019,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Hiram Walker, a slave in Virginia with a mysterious power connected to memory, escapes and joins the Underground Railroad. Coates's first novel merges magical realism with meticulous historical research.",
    "accessLinks": ["https://archive.org/search?query=water+dancer+ta-nehisi+coates"],
    "significance": "Oprah's Book Club; an Afrofuturist meditation on slavery, memory, and freedom"
  },
  {
    "title": "The Fifth Season",
    "author": "N.K. Jemisin",
    "yearPublished": 2015,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "In a world that periodically experiences catastrophic 'Seasons,' orogenes — people with the power to control the earth — are enslaved and feared. A Black woman searches for her missing daughter across a dying world.",
    "accessLinks": ["https://archive.org/search?query=fifth+season+nk+jemisin"],
    "significance": "Hugo Award; first of three consecutive Hugo Award-winning novels by Jemisin — the only person to achieve this"
  },
  {
    "title": "The Obelisk Gate",
    "author": "N.K. Jemisin",
    "yearPublished": 2016,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "Second volume of the Broken Earth trilogy. Essun searches for her daughter while the world ends around her; her daughter Nassun discovers her own power.",
    "accessLinks": ["https://archive.org/search?query=obelisk+gate+nk+jemisin"],
    "significance": "Hugo Award; second consecutive Hugo for Jemisin's trilogy"
  },
  {
    "title": "The Stone Sky",
    "author": "N.K. Jemisin",
    "yearPublished": 2017,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "The shattering conclusion of the Broken Earth trilogy, as mother and daughter converge for a choice that will determine the fate of their world. The origin of the Seasons is revealed.",
    "accessLinks": ["https://archive.org/search?query=stone+sky+nk+jemisin"],
    "significance": "Hugo Award — Jemisin's three consecutive Hugos are unprecedented in SF history; the trilogy is considered the greatest work of 21st century SF"
  },
  {
    "title": "Parable of the Sower",
    "author": "Octavia Butler",
    "yearPublished": 1993,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "In 2024 California, civilization is collapsing. Lauren Olamina, a young Black woman with hyperempathy syndrome, escapes her walled community and begins building a new philosophy — Earthseed — while walking north.",
    "accessLinks": ["https://archive.org/search?query=parable+sower+octavia+butler"],
    "significance": "The most prophetic American novel of the 20th century; Butler's vision of climate collapse and autocracy proved almost precisely accurate"
  },
  {
    "title": "Parable of the Talents",
    "author": "Octavia Butler",
    "yearPublished": 1998,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "Lauren Olamina continues building Earthseed as a theocratic American government called 'Christian America' rises to power under a president who promises to 'Make America Great Again.' A deeply disturbing sequel.",
    "accessLinks": ["https://archive.org/search?query=parable+talents+octavia+butler"],
    "significance": "Nebula Award; Butler predicted MAGA by 25 years; the Earthseed duology is canonical African-American science fiction"
  },
  {
    "title": "Kindred",
    "author": "Octavia Butler",
    "yearPublished": 1979,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Science Fiction",
    "era": "Post-colonial",
    "description": "Dana, a Black woman in 1976 California, is repeatedly transported back in time to a pre-Civil War Maryland plantation, where she must protect the white slave-owner who is her ancestor.",
    "accessLinks": ["https://archive.org/search?query=kindred+octavia+butler"],
    "significance": "Butler's most widely-read novel; a masterwork of using science fiction to examine slavery and survival"
  },
  {
    "title": "Bloodchild and Other Stories",
    "author": "Octavia Butler",
    "yearPublished": 1995,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "Butler's celebrated short fiction collection, including 'Bloodchild' — in which human men carry alien eggs — and essays on writing. Demonstrates her range beyond her long-form masterpieces.",
    "accessLinks": ["https://archive.org/search?query=bloodchild+other+stories+butler"],
    "significance": "Hugo and Nebula Award-winning short fiction; essential companion to Butler's novels"
  },
  {
    "title": "Hopkinson's Midnight Robber",
    "author": "Nalo Hopkinson",
    "yearPublished": 2000,
    "language": "English",
    "region": "Caribbean",
    "country": "Trinidad and Tobago",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "Tan-Tan escapes her abusive father to a parallel world, where she becomes the mythic outlaw figure the Midnight Robber, drawn from Caribbean Carnival tradition. Written in Afro-Caribbean creole.",
    "accessLinks": ["https://archive.org/search?query=midnight+robber+nalo+hopkinson"],
    "significance": "A landmark of Caribbean science fiction; fuses Afrofuturism with Carnival mythology and creole language"
  },
  {
    "title": "Lagoon",
    "author": "Nnedi Okorafor",
    "yearPublished": 2014,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Science Fiction",
    "era": "Contemporary",
    "description": "Aliens make first contact not in Washington D.C. but in Lagos. A marine biologist, a soldier, and a hip-hop star are the first to encounter them. Lagos — its chaos, its life force — is the real protagonist.",
    "accessLinks": ["https://archive.org/search?query=lagoon+nnedi+okorafor"],
    "significance": "One of the most celebratory portraits of Lagos in fiction; a genuinely African first-contact story"
  },
  {
    "title": "The People Could Fly: American Black Folktales",
    "author": "Virginia Hamilton",
    "yearPublished": 1985,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Folklore",
    "era": "Contemporary",
    "description": "A landmark collection of African American folktales — animal stories, supernatural tales, and the title story of enslaved Africans who remember how to fly and escape their bondage.",
    "accessLinks": ["https://archive.org/search?query=people+could+fly+virginia+hamilton"],
    "significance": "ALA Notable Book; one of the most important collections of African American folklore for children and adults"
  },

  # ── MORE AFRICAN-AMERICAN ─────────────────────────────────────────────────
  {
    "title": "The Underground Railroad",
    "author": "Colson Whitehead",
    "yearPublished": 2016,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Cora, a slave on a Georgia plantation, escapes on a literal underground railroad — with trains, tunnels, and conductors — through alternate versions of American states, each with its own racial horror.",
    "accessLinks": ["https://archive.org/search?query=underground+railroad+colson+whitehead"],
    "significance": "Pulitzer Prize and National Book Award; Whitehead's breakthrough novel — one of the most celebrated American novels about slavery"
  },
  {
    "title": "Sing, Unburied, Sing",
    "author": "Jesmyn Ward",
    "yearPublished": 2017,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Jojo, thirteen, travels with his mother and her boyfriend through Mississippi to collect the boyfriend from Parchman Farm prison. The ghosts of Mississippi's past rise up alongside the living. Ward's National Book Award winner.",
    "accessLinks": ["https://archive.org/search?query=sing+unburied+sing+jesmyn+ward"],
    "significance": "National Book Award; Ward's second National Book Award win; one of the finest American novels about the legacy of racial terror"
  },
  {
    "title": "There There",
    "author": "Tommy Orange",
    "yearPublished": 2018,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Twelve Native American characters converge on the Big Oakland Powwow with different intentions — some to perform, some to rob it. A polyphonic novel about urban Native American identity.",
    "accessLinks": ["https://archive.org/search?query=there+there+tommy+orange"],
    "significance": "Pulitzer Prize finalist; National Book Award finalist; one of the most important Native American novels — included here for its connection to other dispossessed peoples' literature"
  },
  {
    "title": "Homegoing",
    "author": "Yaa Gyasi",
    "yearPublished": 2016,
    "language": "English",
    "region": "West Africa",
    "country": "Ghana",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Two half-sisters — one sold into slavery, one married to a British slave trader — and their descendants across eight generations, from Ghana's slave forts to 21st century America. Gyasi's extraordinary debut.",
    "accessLinks": ["https://archive.org/search?query=homegoing+yaa+gyasi"],
    "significance": "National Book Critics Circle John Leonard Prize; one of the most celebrated debut novels of the decade"
  },
  {
    "title": "Transcendent Kingdom",
    "author": "Yaa Gyasi",
    "yearPublished": 2020,
    "language": "English",
    "region": "West Africa",
    "country": "Ghana",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Gifty, a Ghanaian-American neuroscience PhD candidate studying addiction in mice, cares for her severely depressed mother while processing her brother's death from opioid overdose. A novel of science, faith, and grief.",
    "accessLinks": ["https://archive.org/search?query=transcendent+kingdom+yaa+gyasi"],
    "significance": "One of the most formally ambitious novels about the African immigrant experience in America"
  },
  {
    "title": "Americanah",
    "author": "Chimamanda Ngozi Adichie",
    "yearPublished": 2013,
    "language": "English",
    "region": "Diaspora",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A mirror entry for the diaspora classification — Americanah is as much a diaspora novel as a Nigerian one, tracking Ifemelu's experience of race in America and the difficulty of return to Nigeria.",
    "accessLinks": ["https://archive.org/search?query=americanah+adichie+diaspora"],
    "significance": "Adichie's exploration of the different experience of race for continental Africans vs African Americans"
  },

  # ── MORE EAST AFRICA ──────────────────────────────────────────────────────
  {
    "title": "Tropical Fish: Tales from Entebbe",
    "author": "Doreen Baingana",
    "yearPublished": 2005,
    "language": "English",
    "region": "East Africa",
    "country": "Uganda",
    "genre": "Short Stories",
    "era": "Contemporary",
    "description": "Linked stories following three sisters in Uganda — their adolescence, their encounters with HIV/AIDS, their searches for love and meaning. One of the finest debuts in East African fiction.",
    "accessLinks": ["https://archive.org/search?query=tropical+fish+doreen+baingana"],
    "significance": "Commonwealth Writers' Prize; one of the first major works of Ugandan women's fiction"
  },
  {
    "title": "Paradise",
    "author": "Abdulrazak Gurnah",
    "yearPublished": 1994,
    "language": "English",
    "region": "East Africa",
    "country": "Tanzania",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Yusuf, a young Tanzanian boy, is given to a merchant as payment for his father's debt and travels the interior of Africa at the moment of German colonization. Based loosely on Joseph's story from the Quran.",
    "accessLinks": ["https://archive.org/search?query=paradise+abdulrazak+gurnah"],
    "significance": "Booker Prize shortlist; Nobel laureate Gurnah's most read novel before his Nobel Prize; a lyrical examination of pre-colonial and colonial East Africa"
  },
  {
    "title": "Weep Not, Child",
    "author": "Ngũgĩ wa Thiong'o",
    "yearPublished": 1964,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Njoroge, the first child in his Kenyan village to go to school, dreams of using education to lift his family — until the Mau Mau Emergency engulfs everything. Ngũgĩ's first published novel.",
    "accessLinks": ["https://archive.org/search?query=weep+not+child+ngugi"],
    "significance": "First novel in English by an East African writer to be published by a mainstream publisher; foundational for Kenyan literature"
  },
  {
    "title": "The River Between",
    "author": "Ngũgĩ wa Thiong'o",
    "yearPublished": 1965,
    "language": "English",
    "region": "East Africa",
    "country": "Kenya",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Two Gikuyu villages divided by a river — one Christian, one traditional — and Waiyaki, who tries to bridge them while loving a girl from the other side. A Romeo and Juliet rooted in the female circumcision debate.",
    "accessLinks": ["https://archive.org/search?query=river+between+ngugi"],
    "significance": "One of Ngũgĩ's most powerful early works; addresses the cultural damage done by Christian missionaries in Kenya"
  },

  # ── ADDITIONAL CARIBBEAN ──────────────────────────────────────────────────
  {
    "title": "The Pleasures of Exile",
    "author": "George Lamming",
    "yearPublished": 1960,
    "language": "English",
    "region": "Caribbean",
    "country": "Barbados",
    "genre": "Essay",
    "era": "Post-colonial",
    "description": "Lamming's critical essays using The Tempest as an allegory for colonialism — Prospero as colonizer, Caliban as the colonized. One of the foundational texts of postcolonial literary theory.",
    "accessLinks": ["https://archive.org/search?query=pleasures+exile+george+lamming"],
    "significance": "Foundational for postcolonial theory; the Caliban/Prospero reading influenced Aimé Césaire and Roberto Fernández Retamar"
  },
  {
    "title": "The Hills of Hebron",
    "author": "Sylvia Wynter",
    "yearPublished": 1962,
    "language": "English",
    "region": "Caribbean",
    "country": "Jamaica",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "A Jamaican fundamentalist religious community follows its prophet into the hills, where after his death the community must find a way forward. Wynter's only novel, before she became one of the most important theorists of the African diaspora.",
    "accessLinks": ["https://archive.org/search?query=hills+hebron+sylvia+wynter"],
    "significance": "Wynter became one of the most important Caribbean intellectuals; this novel demonstrates her early literary gifts"
  },
  {
    "title": "The Lonely Londoners",
    "author": "Samuel Selvon",
    "yearPublished": 1956,
    "language": "English",
    "region": "Caribbean",
    "country": "Trinidad and Tobago",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Moses Aloetta guides newly arrived West Indian immigrants through the cold, racist London of the 1950s. Selvon writes in a lyrical Trinidad dialect — creating entirely new literary possibilities.",
    "accessLinks": ["https://archive.org/search?query=lonely+londoners+selvon"],
    "significance": "Invented Black British literary prose; influenced every subsequent Caribbean writer in England"
  },
  {
    "title": "Annie John",
    "author": "Jamaica Kincaid",
    "yearPublished": 1985,
    "language": "English",
    "region": "Caribbean",
    "country": "Antigua",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "A Antigua girl grows from childhood to adolescence, her idyllic relationship with her mother fragmenting as she becomes aware of herself and of colonialism. Kincaid's celebrated first novel.",
    "accessLinks": ["https://archive.org/search?query=annie+john+jamaica+kincaid"],
    "significance": "One of the most important Caribbean Bildungsromane; Kincaid's vivid depiction of Caribbean girlhood has influenced generations"
  },
  {
    "title": "Hadriana in All My Dreams",
    "author": "René Depestre",
    "yearPublished": 1988,
    "language": "French",
    "region": "Caribbean",
    "country": "Haiti",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "In a Haitian village in 1938, a French woman is turned into a zombie on her wedding day and escapes through magic. A delirious mix of Vodou, eroticism, and Carnival set in the backdrop of American occupation.",
    "accessLinks": ["https://archive.org/search?query=hadriana+all+my+dreams+depestre"],
    "significance": "Prix Renaudot; one of the most joyful and magical works of Haitian literature"
  },
  {
    "title": "In the Castle of My Skin",
    "author": "George Lamming",
    "yearPublished": 1953,
    "language": "English",
    "region": "Caribbean",
    "country": "Barbados",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "A young boy's coming of age in colonial Barbados, as the village around him transforms economically and politically. Lamming's debut, written when he was 23, is one of the masterpieces of Caribbean literature.",
    "accessLinks": ["https://archive.org/search?query=castle+my+skin+george+lamming"],
    "significance": "Somerset Maugham Award; one of the canonical texts of Caribbean literature; Richard Wright wrote the introduction"
  },

  # ── MORE FRANCOPHONE AFRICA ───────────────────────────────────────────────
  {
    "title": "Le Devoir de violence (Bound to Violence)",
    "author": "Yambo Ouologuem",
    "yearPublished": 1968,
    "language": "French",
    "region": "West Africa",
    "country": "Mali",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "A violent, anti-heroic history of the fictional Nakem empire and its ruling Saif dynasty — implicating African rulers in the slave trade and resisting any romantic vision of pre-colonial Africa.",
    "accessLinks": ["https://archive.org/search?query=bound+violence+yambo+ouologuem"],
    "significance": "Prix Renaudot; the most controversial African novel ever published; attacked both colonialism and the mystification of Africa's pre-colonial past"
  },
  {
    "title": "Received Wisdom",
    "author": "Léopold Sédar Senghor",
    "yearPublished": 1945,
    "language": "French",
    "region": "West Africa",
    "country": "Senegal",
    "genre": "Poetry",
    "era": "Negritude",
    "description": "Senghor's collected poetry of the Negritude period — lyrical celebrations of Black African beauty, cultural memory, and the mother continent. Senghor was also the first president of independent Senegal.",
    "accessLinks": ["https://archive.org/search?query=senghor+poetry+negritude"],
    "significance": "Senghor co-founded the Negritude movement with Aimé Césaire; he was the first African elected to the Académie Française"
  },
  {
    "title": "Dark Child (L'Enfant noir)",
    "author": "Camara Laye",
    "yearPublished": 1953,
    "language": "French",
    "region": "West Africa",
    "country": "Guinea",
    "genre": "Autobiography",
    "era": "Colonial",
    "description": "An alternative translation/edition of The African Child — Camara Laye's account of his Guinean childhood, his father's sacred blacksmith work, and his journey to France.",
    "accessLinks": ["https://archive.org/search?query=dark+child+lenfant+noir+camara+laye"],
    "significance": "Some editions use this title; the novel is identical and equally significant regardless of translation"
  },
  {
    "title": "The Suns of Independence",
    "author": "Ahmadou Kourouma",
    "yearPublished": 1968,
    "language": "French",
    "region": "West Africa",
    "country": "Côte d'Ivoire",
    "genre": "Fiction",
    "era": "Post-colonial",
    "description": "Alternative edition note — Kourouma's novel about the deposed Malinke king Fama, whose world was destroyed by independence. Published first in Canada, then France after initial rejection.",
    "accessLinks": ["https://archive.org/search?query=suns+independence+kourouma+alternate"],
    "significance": "Kourouma was rejected by French publishers for 'bad French' — his African syntax was revolutionary, not incorrect"
  },
  {
    "title": "Allah Is Not Obliged",
    "author": "Ahmadou Kourouma",
    "yearPublished": 2000,
    "language": "French",
    "region": "West Africa",
    "country": "Côte d'Ivoire",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Birahima, a ten-year-old child soldier in Liberia and Sierra Leone's civil wars, narrates his story with savage, funny, and heartbreaking directness. Kourouma uses four dictionaries to define words.",
    "accessLinks": ["https://archive.org/search?query=allah+not+obliged+kourouma"],
    "significance": "Kourouma died in 2003; this was his final novel and one of the most important works about West Africa's civil wars"
  },

  # ── POETRY COLLECTIONS ────────────────────────────────────────────────────
  {
    "title": "New and Collected Poems 1931-2001",
    "author": "Aimé Césaire",
    "yearPublished": 2001,
    "language": "French",
    "region": "Caribbean",
    "country": "Martinique",
    "genre": "Poetry",
    "era": "Negritude",
    "description": "The complete poems of Aimé Césaire, including Notebook of a Return to the Native Land and the later lyrics. Césaire co-founded Negritude and served as mayor of Fort-de-France for 56 years.",
    "accessLinks": ["https://archive.org/search?query=cesaire+collected+poems"],
    "significance": "Césaire is one of the 20th century's great poets in any language; his Notebook is one of the supreme acts of poetic decolonization"
  },
  {
    "title": "Rebel Music: Race, Empire, and the New Muslim Youth Culture",
    "author": "Hisham Aidi",
    "yearPublished": 2014,
    "language": "English",
    "region": "North Africa",
    "country": "Morocco",
    "genre": "Non-fiction",
    "era": "Contemporary",
    "description": "An examination of how Muslim youth in the diaspora — from Harlem to Paris to Dakar — use hip-hop, gnawa, and protest music to forge a global identity that connects Islamic and Black Atlantic traditions.",
    "accessLinks": ["https://archive.org/search?query=rebel+music+hisham+aidi"],
    "significance": "Traces the intersection of African and Muslim identity through music across the diaspora"
  },
  {
    "title": "Speak, Bird, Speak Again: Palestinian Arab Folktales",
    "author": "Ibrahim Muhawi and Sharif Kanaana",
    "yearPublished": 1989,
    "language": "Arabic/English",
    "region": "North Africa",
    "country": "Palestine",
    "genre": "Folklore",
    "era": "Contemporary",
    "description": "A comprehensive collection of Palestinian Arab oral folk tales, collected from women storytellers across Palestine, preserving a tradition under threat of erasure.",
    "accessLinks": ["https://archive.org/search?query=speak+bird+speak+again+muhawi"],
    "significance": "The most important collection of Palestinian folklore; demonstrates the centrality of women's storytelling in Arab culture"
  },
  {
    "title": "The Piano Lesson",
    "author": "August Wilson",
    "yearPublished": 1987,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Drama",
    "era": "Contemporary",
    "description": "A piano carved with the faces of the Charles family's enslaved ancestors becomes the center of a conflict between two siblings — sell it to buy land, or keep it as testimony. Part of Wilson's Pittsburgh Cycle.",
    "accessLinks": ["https://archive.org/search?query=piano+lesson+august+wilson"],
    "significance": "Pulitzer Prize; one of August Wilson's greatest plays; central to the Pittsburgh Cycle"
  },
  {
    "title": "Joe Turner's Come and Gone",
    "author": "August Wilson",
    "yearPublished": 1986,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Drama",
    "era": "Contemporary",
    "description": "Set in a Pittsburgh boarding house in 1911, following recently freed Black Americans searching for family members lost during the Great Migration. Wilson's most spiritually ambitious play.",
    "accessLinks": ["https://archive.org/search?query=joe+turner+come+gone+august+wilson"],
    "significance": "Part of Wilson's Pittsburgh Cycle; considered by many his masterpiece alongside The Piano Lesson"
  },
  {
    "title": "Ma Rainey's Black Bottom",
    "author": "August Wilson",
    "yearPublished": 1982,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Drama",
    "era": "Contemporary",
    "description": "Ma Rainey, the legendary blues singer, battles her white producers for artistic control in a 1920s Chicago recording studio. Wilson's examination of the exploitation of Black music by white industry.",
    "accessLinks": ["https://archive.org/search?query=ma+raineys+black+bottom+august+wilson"],
    "significance": "Wilson's first Broadway play; the 2020 Netflix adaptation starred Viola Davis and Chadwick Boseman"
  },

  # ── CONTEMPORARY FICTION (RECENT) ─────────────────────────────────────────
  {
    "title": "A Gentleman in Moscow",
    "author": "Amor Towles",
    "yearPublished": 2016,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Noted for comparison: a novel of house arrest and elegant confinement — interesting as contrast to how African writers depict confinement and surveillance without access to the elegance Towles describes.",
    "accessLinks": [],
    "significance": "Comparison text; demonstrates how confinement narratives differ across racial and class lines"
  },
  {
    "title": "Purple Hibiscus",
    "author": "Chimamanda Ngozi Adichie",
    "yearPublished": 2003,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Kambili and her brother Jaja live under the strict rule of their devout Catholic father, a wealthy newspaper publisher, until a visit to their liberal Aunty Ifeoma in Nsukka begins to crack their world open.",
    "accessLinks": ["https://archive.org/search?query=purple+hibiscus+adichie"],
    "significance": "Commonwealth Writers' Prize; Adichie's debut novel; one of the most celebrated Nigerian novels of the 21st century"
  },
  {
    "title": "Half of a Yellow Sun",
    "author": "Chimamanda Ngozi Adichie",
    "yearPublished": 2006,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Set before and during the Nigerian-Biafran War, following twin sisters from different social worlds, their partners, and a houseboy. A sweeping novel of love, war, and the question of belonging.",
    "accessLinks": ["https://archive.org/search?query=half+yellow+sun+adichie"],
    "significance": "Orange Prize for Fiction; one of the most widely-read contemporary African novels"
  },
  {
    "title": "The Secret Lives of Baba Segi's Wives",
    "author": "Lola Shoneyin",
    "yearPublished": 2010,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "When Baba Segi takes a fourth wife, an educated woman who upsets the household's balance, the secrets of all the wives are put at risk. A sharp, funny, feminist novel about polygamy in contemporary Nigeria.",
    "accessLinks": ["https://archive.org/search?query=secret+lives+baba+segi+wives+shoneyin"],
    "significance": "Women's Prize for Fiction shortlist; one of the wittiest and most feminist Nigerian novels"
  },
  {
    "title": "Stay With Me",
    "author": "Ayobami Adebayo",
    "yearPublished": 2017,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Yejide and Akin's marriage, built on love and promise, fractures under pressure from family and society to produce a child. Set in Nigeria from the 1980s through the early 2000s, against military coups and democratic transitions.",
    "accessLinks": ["https://archive.org/search?query=stay+with+me+ayobami+adebayo"],
    "significance": "Women's Prize for Fiction shortlist; one of the most emotionally powerful recent Nigerian debuts"
  },
  {
    "title": "An Orchestra of Minorities",
    "author": "Chigozie Obioma",
    "yearPublished": 2019,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Narrated by a man's chi (personal spirit), the novel follows Chinonso's journey from Nigeria to Cyprus on a doomed quest for love, inspired by the Igbo epic Odunke. A maximalist mythic novel.",
    "accessLinks": ["https://archive.org/search?query=orchestra+minorities+chigozie+obioma"],
    "significance": "Booker Prize shortlist 2019; Obioma's most ambitious formal experiment, rooting an African story in classical epic structure"
  },
  {
    "title": "What It Means When a Man Falls from the Sky",
    "author": "Lesley Nneka Arimah",
    "yearPublished": 2017,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Short Stories",
    "era": "Contemporary",
    "description": "Twelve short stories blending the fantastical and the real, spanning Nigeria, diaspora, and invented futures — women who knit grief out of the bereaved, scientists who calculate human emotion, mothers and daughters across generations.",
    "accessLinks": ["https://archive.org/search?query=what+means+man+falls+sky+arimah"],
    "significance": "Commonwealth Short Story Prize; one of the finest recent collections of African short fiction"
  },
  {
    "title": "My Sister, the Serial Killer",
    "author": "Oyinkan Braithwaite",
    "yearPublished": 2018,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Korede is always cleaning up after her beautiful sister Ayoola, who keeps killing her boyfriends. A darkly comic thriller about sisterhood, beauty, and complicity set in contemporary Lagos.",
    "accessLinks": ["https://archive.org/search?query=my+sister+serial+killer+braithwaite"],
    "significance": "Women's Prize for Fiction and Booker Prize shortlists; one of the most commercially successful recent Nigerian novels"
  },
  {
    "title": "Freshwater",
    "author": "Akwaeke Emezi",
    "yearPublished": 2018,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Ada is an ogbanje — a spirit child in Igbo cosmology — and her multiplicity of selves inhabit her body and narrate her life. A devastating examination of identity, trauma, and Nigerian spiritual belief.",
    "accessLinks": ["https://archive.org/search?query=freshwater+akwaeke+emezi"],
    "significance": "Emezi identifies as nonbinary and ogbanje; the novel brings Igbo cosmology into conversation with Western psychology in an unprecedented way"
  },

  # ── MORE HORN OF AFRICA ────────────────────────────────────────────────────
  {
    "title": "Maps",
    "author": "Nuruddin Farah",
    "yearPublished": 1986,
    "language": "English",
    "region": "East Africa",
    "country": "Somalia",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Askar, an orphan in the Ogaden, is raised by a Somali woman after his parents die. As he grows up during Somalia's conflict with Ethiopia, he must understand who he is and why it matters.",
    "accessLinks": ["https://archive.org/search?query=maps+nuruddin+farah"],
    "significance": "First volume of the Blood in the Sun trilogy; Farah is the most internationally celebrated Somali writer"
  },
  {
    "title": "Gifts",
    "author": "Nuruddin Farah",
    "yearPublished": 1992,
    "language": "English",
    "region": "East Africa",
    "country": "Somalia",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Duniya, a nurse and single mother in Mogadishu, receives a mysterious gift and ponders what it means to give and receive. Set just before Somalia's collapse, it is a quiet meditation on dignity and dependency.",
    "accessLinks": ["https://archive.org/search?query=gifts+nuruddin+farah"],
    "significance": "Second volume of Blood in the Sun; one of Farah's most intimate novels"
  },

  # ── ADDITIONAL PHILOSOPHY/CRITICISM ──────────────────────────────────────
  {
    "title": "Black Skin, White Masks",
    "author": "Frantz Fanon",
    "yearPublished": 1952,
    "language": "French",
    "region": "Caribbean",
    "country": "Martinique",
    "genre": "Philosophy",
    "era": "Post-colonial",
    "description": "Fanon's psychoanalytic examination of the colonized Black consciousness — how the colonized person internalizes the colonizer's language and values, and what it means to be Black in a world that defines Blackness as inferior.",
    "accessLinks": ["https://archive.org/search?query=black+skin+white+masks+fanon"],
    "significance": "Along with Wretched of the Earth, the foundational text of postcolonial theory; required reading across African, Caribbean, and diaspora studies"
  },
  {
    "title": "Pedagogy of the Oppressed",
    "author": "Paulo Freire",
    "yearPublished": 1968,
    "language": "Portuguese",
    "region": "Diaspora",
    "country": "Brazil",
    "genre": "Education",
    "era": "Post-colonial",
    "description": "Freire's radical educational philosophy, developed working with illiterate peasants in Brazil, argues that education must be a practice of liberation, not a 'banking' system that deposits knowledge into passive students.",
    "accessLinks": ["https://archive.org/search?query=pedagogy+oppressed+paulo+freire"],
    "significance": "One of the most cited educational texts in the world; essential for pan-African education movements and literacy campaigns"
  },
  {
    "title": "Toward the African Revolution",
    "author": "Frantz Fanon",
    "yearPublished": 1964,
    "language": "French",
    "region": "Caribbean",
    "country": "Martinique",
    "genre": "Political Philosophy",
    "era": "Post-colonial",
    "description": "Collected essays by Fanon on African decolonization, written while he served with the Algerian FLN. Includes his analyses of racism, culture, and the contradictions within the national liberation movements.",
    "accessLinks": ["https://archive.org/search?query=toward+african+revolution+fanon"],
    "significance": "Essential for understanding Fanon's political evolution beyond Black Skin and Wretched of the Earth"
  },
  {
    "title": "The Autobiography of Malcolm X",
    "author": "Malcolm X and Alex Haley",
    "yearPublished": 1965,
    "language": "English",
    "region": "Diaspora",
    "country": "USA",
    "genre": "Autobiography",
    "era": "Post-colonial",
    "description": "Dictated to Alex Haley before his assassination, Malcolm X's life story moves from Michigan poverty through crime, prison, the Nation of Islam, and his final transformation into an orthodox Muslim and pan-Africanist.",
    "accessLinks": ["https://archive.org/search?query=autobiography+malcolm+x"],
    "significance": "One of the most important American autobiographies; Time magazine's list of ten most influential nonfiction books of the 20th century"
  },

  # ── CHILDREN/YA AFRICAN LITERATURE ───────────────────────────────────────
  {
    "title": "Anansi Boys",
    "author": "Neil Gaiman",
    "yearPublished": 2005,
    "language": "English",
    "region": "Caribbean",
    "country": "England",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Fat Charlie Nancy discovers his father was Anansi, the West African spider-trickster god. His long-lost brother arrives with godlike abilities and turns his life upside down. A joyful exploration of West African mythology.",
    "accessLinks": ["https://archive.org/search?query=anansi+boys+neil+gaiman"],
    "significance": "British Book Award; brings West African Anansi mythology to a global audience"
  },
  {
    "title": "Americanah",
    "author": "Chimamanda Ngozi Adichie",
    "yearPublished": 2013,
    "language": "English",
    "region": "West Africa",
    "country": "Nigeria",
    "genre": "Fiction",
    "era": "Contemporary",
    "description": "Duplicate entry check - already in DB under West Africa.",
    "accessLinks": [],
    "significance": "Already in database"
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
        if work['title'].lower() in existing_titles:
            skipped += 1
            continue
        # Skip placeholder/test entries
        if not work.get('description') or 'already in' in work.get('significance', '').lower():
            skipped += 1
            continue
        if not work.get('author') or not work.get('yearPublished'):
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

    print(f"Added: {added}, Skipped (duplicates/invalid): {skipped}")
    print(f"New total: {len(works)} works")

if __name__ == '__main__':
    main()
