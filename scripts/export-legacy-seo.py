import subprocess, json, re, sys
M='/opt/homebrew/opt/mysql/bin/mysql'
def q(sql):
    out=subprocess.run([M,'-uroot','auruslife_db','--default-character-set=binary','-N','-B','-e',sql],capture_output=True).stdout.decode('ascii')
    rows=[]
    for line in out.splitlines():
        rows.append([dec(x) for x in line.split('\t')])
    return rows
def dec(h):
    if h=='NULL': return ''
    b=bytes.fromhex(h)
    try: return b.decode('utf-8')
    except UnicodeDecodeError: return b.decode('cp1252',errors='replace')
def hx(cols): return ','.join(f'HEX(CAST({c} AS BINARY))' for c in cols)
BASE='https://www.auruslife.com'
cities=q(f"select {hx(['id','cityname','slug'])} from aurus_cities where status='Active' order by id")
locs=q(f"select {hx(['id','localityname','cityid','slug'])} from aurus_locality where status='Active' order by id")
cols=q(f"select {hx(['id','collegename','cityid','slug'])} from aurus_college where status='Active' order by id")
meta=q(f"select {hx(['id','url','seotitle','seodesc','seokeywords','breadtitle','breaddesc','bottomtitle','bottomdesc'])} from aurus_seo_meta order by id")
faq=q(f"select {hx(['id','url','question','answer'])} from aurus_seo_faq order by id")
metaBy={}
for m in meta:
    metaBy.setdefault(m[1].strip().lower().rstrip('/'),m)   # first row wins, like the old code
faqBy={}
for f in faq:
    faqBy.setdefault(f[1].strip().lower().rstrip('/'),[]).append({'question':f[2].strip(),'answer':f[3].strip()})
# new-site slugs
NEWCITY={'mumbai','pune','ahmedabad','noida','jalandhar'}
NEWLOC={'mumbai':{'juhu':'juhu','vile-parle':'vile-parle','andheri':'andheri-west','churchgate':'churchgate','fort':'fort','st-xaviers':'st-xaviers','knowledge-park-2':'knowledge-park-2','knowledge-park-3':'knowledge-park-3'},
        'ahmedabad':{'ambawadi':'ambawadi'},'pune':{'lavale':'lavale','susgaon':'susgaon'},'noida':{'sector-126':'sector-126'},'jalandhar':{'phagwara':'phagwara'}}
NEWINST={'mumbai':{'mithibai-college':'mithibai-college','nm-college':'nm-college','upg-college':'upg-college','nmims':'nmims-college','raheja-college':'raheja-college','dj-sanghvi':'dj-sanghvi-college'},
         'pune':{'symbiosis':'symbiosis-college'},'noida':{'amity-university-noida':'amity-university'}}
def paras(t):
    t=re.sub(r'<br\s*/?>','\n',t,flags=re.I)
    t=re.sub(r'<[^>]+>','',t)
    return [re.sub(r'\s+',' ',p).strip() for p in t.split('\n') if p.strip()]
def one(t): return re.sub(r'\s+',' ',t).strip()
pages=[]
def add(path,kind,prefix,gender,category,city,oldSlug,newSlug,name):
    key=(BASE+path).lower()
    m=metaBy.get(key); f=faqBy.get(key,[])
    e={'path':path,'kind':kind,'prefix':prefix,'gender':gender,'category':category,'citySlug':city[2].lower(),'cityName':city[1],
       'oldSlug':oldSlug,'newSlug':newSlug,'name':name,'hasMeta':bool(m)}
    if m:
        e.update({'title':one(m[2]),'description':one(m[3]),'keywords':one(m[4]),'h1':one(m[5]),'intro':one(m[6]),
                  'bottomTitle':one(m[7]),'bottomDesc':paras(m[8])})
    e['faqs']=[{'question':one(x['question']),'answer':one(x['answer'])} for x in f]
    pages.append(e)
V=[('pg','',  'PG'),('girls-pg','girls','PG'),('boys-pg','boys','PG'),('hostel','','Hostel'),('girls-hostel','girls','Hostel'),('boys-hostel','boys','Hostel')]
for c in cities:
    cid,cname,cslug=c
    for v,g,cat in V:
        add(f'/{v}-listing/{cslug}','city',v,g,cat,c,None,None,cname)
    for l in [l for l in locs if l[2]==cid]:
        ns=NEWLOC.get(cslug.lower(),{}).get(l[3].lower())
        for v,g,cat in V:
            add(f'/{v}-listings/{l[3]}/{cslug}','locality',v,g,cat,c,l[3],ns,l[1])
    for k in [k for k in cols if k[2]==cid]:
        ns=NEWINST.get(cslug.lower(),{}).get(k[3].lower())
        for v,cat in (('pg','PG'),('hostel','Hostel')):
            add(f'/{v}_listings/{k[3]}/{cslug}','institute',v,'',cat,c,k[3],ns,k[1])
pune=[c for c in cities if c[2].lower()=='pune'][0]
add('/pg_listings/bharati-vidyapeeth-university/pune','institute','pg','','PG',pune,'bharati-vidyapeeth-university',None,'Bharati Vidyapeeth University')
used={(BASE+p['path']).lower() for p in pages}
orphans=[m[1] for m in meta if m[1].strip().lower().rstrip('/') not in used]
dropped=[p['path'] for p in pages if p['citySlug'] not in NEWCITY and (p['hasMeta'] or p['faqs'])]
print('dropped (city not on new site):',dropped,file=sys.stderr)
rich={(p['citySlug'],p['oldSlug']) for p in pages if p['kind']=='institute' and (p['hasMeta'] or p['faqs'] or p['newSlug'])}
keep=[p for p in pages if p['citySlug'] in NEWCITY]
print('all footer pages',len(pages),'| kept',len(keep),'| with meta',sum(p['hasMeta'] for p in keep),'| with faqs',sum(bool(p['faqs']) for p in keep),file=sys.stderr)
print('meta rows not reachable from any footer link:',sorted(set(orphans)),file=sys.stderr)
import collections
print(collections.Counter((p['citySlug'],p['kind']) for p in keep),file=sys.stderr)
json.dump(pages,open(sys.argv[1]+'/legacy_all.json','w'),ensure_ascii=False,indent=1)
for p in keep: p.pop('hasMeta')
keep=[{k:v for k,v in p.items() if v not in ('',[],None) or k in ('oldSlug','newSlug','gender','faqs')} for p in keep]
json.dump(keep,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
