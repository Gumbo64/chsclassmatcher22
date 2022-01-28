#!/usr/bin/env python
# coding: utf-8

# In[2]:


import pandas as pd
import numpy as np
import json
 
    

do_accma_mixing = False

classes_or_subjects = "subjects"

    
# Opening JSON file
f = open('classes2022.json')
 
# returns JSON object as
# a dictionary
data = json.load(f)
df = pd.DataFrame(data)

newcolumn = []
for idata in data:
    my_sub_total = []
    for (item1, item2) in zip(idata["subjects"], idata["numbers"]):
        my_sub_total.append(item1+item2)
    newcolumn.append(my_sub_total)

df.insert(3,"classes",newcolumn,False)
        
#     combined subjects (subject + number)







del df['_id']
del df['numbers']
df

# df = pd.read_csv('classes2022.csv')


# In[28]:


df


# In[1]:


# this give the percentage from the point of view of y

# accel_mixing means treat ACCMA as MAA and ACCMAX as MXT.1
def similarity(y,x,do_accma_mixing,classes_or_subjects):
    score = 0
    totalunits = 0
    units = 0
    for i in y:
        
        if ("XT" in i or "SOR" in i or "ACCMAX" in i):
            units = 1
        elif (i=="" or i=="ENG" and classes_or_subjects == "subjects"):
            units=0
        else:
            units = 2
        
        
        accma_mix = ((i == "ACCMA" and "MAA" in x) or (i == "MAA" and "ACCMA" in x)) 
        accmax_mix = ((i == "ACCMAX" and "MXT.1" in x) or (i == "MXT.1" and "ACCMAX" in x)) 
        
        if (i in x or (do_accma_mixing and classes_or_subjects == "subjects" and (accma_mix or accmax_mix))):
            score += units
        
        totalunits += units
    
    return score/totalunits


# In[30]:


# Add similarity matrix

from collections import defaultdict
classpopularity = defaultdict(lambda: 0)


namestotal = []
for j in range(len(df)):
    newcolumn = []
    namestotal.append(df.loc[j,"name"])
#     similarityPOV = df.loc[j,"classes"]
    similarityPOV = df.loc[j,classes_or_subjects]
    
    for i in similarityPOV:
        classpopularity[i]+=1
        
    for i in range(len(df)) :
        otheruser = df.loc[i,classes_or_subjects]
#         otheruser = df.loc[i,"classes"]
        newcolumn.append(similarity(otheruser,similarityPOV,do_accma_mixing,classes_or_subjects))
    df.insert(3,df.loc[j,"name"],newcolumn,False)


# In[31]:


from sklearn.preprocessing import StandardScaler

x = df.loc[:, namestotal].values# Separating out the target
x = StandardScaler().fit_transform(x)


# In[32]:


x


# In[33]:


from sklearn.decomposition import PCA
pca = PCA(n_components=2)
principalComponents = pca.fit_transform(x)
principalDf = pd.DataFrame(data = principalComponents, columns = ['p1', 'p2'])

finalDf = pd.concat([df,principalDf], axis = 1)


# In[34]:


print(pca.explained_variance_ratio_)
print(np.sum(pca.explained_variance_ratio_))


# In[35]:


popsorted = sorted(classpopularity, key=classpopularity.get, reverse=True)
for i in popsorted:
    print([i,classpopularity[i]])


# In[36]:


# colourpriority = ['PHY',"ACCMA","BIO"]
# # colourpriority = []
# colours = {
#     'PHY':"blue",
#     "ACCMA":"red",
#     'BIO':"yellow",
#     'else':"grey"
# }

# newcolumn = []
# for i in range(len(df)):

#     mysubjects = df.loc[i,"subjects"]
# #     mysubjects = df.loc[i,"zazaza"]
    
#     gotcolour = False
    
#     for subject in colourpriority:
#         if subject in mysubjects:
#             newcolumn.append(colours[subject])
#             gotcolour = True
#             break
#     else:
#         newcolumn.append(colours["else"])

    
# finalDf.insert(3,"colour",newcolumn,False)
    


# In[37]:


from kneed import KneeLocator
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score


kmeans = KMeans(
    init="random",
    n_clusters=4,
    n_init=100,
    max_iter=300,
    random_state=42
)
kmeans.fit(x)


# # A list holds the SSE values for each k
# sse = []
# for k in range(1, 11):
#     kmeans = KMeans(n_clusters=k,
#         n_init=10,
#         max_iter=300,
#         random_state=42)
#     kmeans.fit(x)
#     sse.append(kmeans.inertia_)

# plt.style.use("fivethirtyeight")
# plt.plot(range(1, 11), sse)
# plt.xticks(range(1, 11))
# plt.xlabel("Number of Clusters")
# plt.ylabel("SSE")
# plt.show()



# In[38]:


colour_array = ["yellow","red","blue","green","pink","orange","purple","cyan"]


clusters = kmeans.labels_
colours = []
for i in clusters:
    colours.append(colour_array[i])



colours = pd.DataFrame(data = colours, columns = ['colour'])

kDF = pd.concat([finalDf,colours], axis = 1)


# In[3]:



# validsubjects = [
#     'ACCMA', 'ACCMAX', 'ANC',
#     'BIO',  'BUS',   'CHE',    'D+T',
#     'ECO',  'ENN',    'EXT',
#     'FRE',  'GEO',   'INV',    'JAP',
#     'LEG',  'MAA',   'MAS',    'MOD',
#     'MUS1', 'MUS2',  'MXT.1',  'PDHPE',
#     'PHY',  'SAC',   'SDD',    'SOR',
#     'VIS'
#   ]

# for j in validsubjects:
    
#     similarityPOV = [j]
    
#     for i in range(len(df)):
#         otheruser = df.loc[i,classes_or_subjects]
# #         otheruser = df.loc[i,"classes"]
#         newcolumn.append(similarity(otheruser,similarityPOV,do_accma_mixing,classes_or_subjects))
#     df.insert(3,df.loc[j,"name"],newcolumn,False)


# In[ ]:


import matplotlib.pyplot as plt
from adjustText import adjust_text
# from matplotlib.pyplot import figure

# figure(num=1,figsize=(20, 20), dpi=80)

# open figure + axis
fig = plt.figure(figsize=(6, 6),dpi=3000)
ax = fig.add_subplot(111)
fig.patch.set_alpha(1)
# plot


ax.scatter(x=kDF['p1'],y=kDF['p2'],c=kDF['colour'],marker="o")
# ax.scatter(x=kmeans.cluster_centers_[kmeans.cluster_centers_],y=,c="black",marker="X")
# set labels
# print(kmeans.cluster_centers_)

ax.set_xlabel('p1')
ax.set_ylabel('p2')


# annotate points in axis
texts = []
for idx, row in kDF.iterrows():
    texts.append(plt.text(row['p1'], row['p2'] , row['name'], ha='center', va='center', fontsize=5 ))
adjust_text(texts)
# for idx, row in kDF.iterrows():
#     ax.annotate(row['name'], (row['p1'] + 0.2, row['p2']), fontsize=5 )


plt.title("2022 " +classes_or_subjects+", accelerated math mixing: "+ str(do_accma_mixing and classes_or_subjects == "subjects"))
plt.savefig("2022 " +classes_or_subjects+", accelerated math mixing: "+ str(do_accma_mixing and classes_or_subjects == "subjects")+'.svg')
# plt.show()


# In[ ]:




