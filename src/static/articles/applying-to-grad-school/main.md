---
title: Applying to Graduate School
snippet:
  My process for choosing schools, and a graduate student survey. Includes an
  interactive dataset scraped from the Philosophical Gourmet.
publishedAt: 3 Dec 2024
lastEdit: 30 Dec 2024
---

_EDIT 12-10-24: I've updated the website, so the dataset should now be embedded.
I also added an introductory section and touched up the rest._

_EDIT 12-30-24: Shortened the introduction._

## why go to grad school?

I got a dual bachelor's in mathematics and philosophy in 2017. Since that time,
I've built up a career in software engineering which many would be jealous of.
However, I find myself compelled by the limits of knowledge, with what can and
cannot be rationally expressed, and I longed to find the answers to questions
which I have been chewing on for half a decade. A long-term fascination of mine
is the crisis in the foundations of mathematics in the early 20th century, and
the questions that philosophers and mathematicians have come up with in an
attempt to answer it. These are epistemological, metalogical, and metaphysical
questions, questions about what can be known, what can be expressed rationally,
and about what things there are or possibly could be.

As for practical concerns: philosophy is a notoriously difficult subject to get
a career in. If you can manage to get into a highly-ranked university and
graduate _summa cum laude_ you're still not guaranteed a job. The general
consensus is that if you want to go to graduate school for philosophy, you
really should reconsider. Last I checked, philosophy still lags behind other
humanities disciplines in their efforts toward further inclusivity, and it is
not known as a safe place for minorities. Thankfully, the situation has been
changing, though it still has a long ways to go. Nonetheless, I feel compelled
to apply, and I have a fruitful career in technology to return to if things fall
by the wayside. So the decision is made: but where to start?

## philosophical gourmet data

If I'm going to go into a risky field, I'm going to do everything I can to
ensure that I'm going to get everything out of it. I began by scraping data from
the
[philosophical gourmet](https://www.philosophicalgourmet.com/summary-of-specialty-rankings/)
using the table available under the header
["summary of specialty rankings."](https://www.philosophicalgourmet.com/summary-of-specialty-rankings/)
I did this part manually, using query selectors to construct a JSON table. Once
that was done, I created a [JupyterLab notebook](https://jupyter.org) and
collated the data using [Polars](https://pola.rs) and
[Perspective](https://github.com/finos/perspective). This was actually done
while working at Prospective, the company behind this visualization tool, so it
should come as no surprise that I used what I was familiar with. I ranked the
data by mapping my areas of interest to a scale, with 1 as the highest ranking.
To rank the data, all I had to do was multiply, and replace null values with an
absurdly high digit (1000 in my case). This allowed me to sort in descending
order, placing top-ranked schools with my preferred areas on top of all the
rest. You can see the final notebook
[on my github](https://github.com/ada-x64/phil-gourmet). Below, I've embedded a
Perspective table with the full dataset, not including my filters.

`\iframe{/static/media/phil_gourmet.html}`{=latex}
[(Fullscreen - Click here)](https://cubething.dev/static/media/phil_gourmet.html).

Once I had manually gone over the results and ensured that they were what I
wanted (right location, right faculty), I chose my top 6 schools. They are:
CUNY, Toronto, UBC, UCR, Colombia, and Yale. God help me. In addition, I'd like
to apply to Memphis and the Univeristy of Kansas, my alma matter, as backups.

**Update:** In the end I applied to CUNY, Toronto, UBC, UC Berkeley, Brown, and
KU. I'm deeply thankful for the time and letters from my former professors, and
for the time I've taken from students at these institutions.

## annoying 311 grad students

Now, it is often suggested that people get in contact with graduate students at
the universities they wish to attend. I'm shy (autistic, really) and
statistically oriented, so I decided instead to scrape the websites and send a
batch email. In the email I attached a survey asking for demographics and
satisfaction ratings in a handful of categories. I know that it's the end of the
semester (December 3 as I am writing), and that graduate students are busy,
_and_ that it's very suspicious to get a bulk email asking for somewhat
identifying information. However, I am not collecting the emails of the students
I contact, nor their names or their advisers. Instead, I am only asking for
basic demographic information such as age, minority status, employment status,
and income, as well as TA availability at the university, and general
satisfaction rankings. Importantly, all of this information is optional. As far
as satisfaction rankings go, I am asking about career opportunities,
satisfaction with the courses and advisers, and feelings of safety on and around
campus. In addition, I requested volunteers to share application materials, such
as statements of purpose and writings samples. This data is not to be shared and
is solely for my benefit. (Gotta shoot your shot.)

It remains to be seen whether anybody responds to the survey. I am hoping so. I
will keep this blog updated with my application status and any further
information on my nefarious scheme to get people to help me. If you are one of
the people I've emailed, thank you for being here :) And no, you're not getting
phished, I promise.

---

P.S. I am currently working on an updated version of this site which allows me
to use LaTeX in addition to Markdown to format posts. This has been my primary
workhorse for writing lately. As I've been focused on grad school applications
and raising my daughter I've been a bit too busy to finish it up just yet, but
it's nearly there.
