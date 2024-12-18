---
title: Applying to Graduate School
snippet:
  My process for choosing schools, and a graduate student survey. Includes an
  interactive dataset scraped from the Philosophical Gourmet.
publishedAt: 3 Dec 2024
lastEdit: 10 Dec 2024
---

_EDIT 12-10-24: I've updated the website, so the dataset should now be embedded.
I also added an introductory section and touched up the rest._

## why go to grad school?

When I went to college I initially was going to study economics and political
science. I thought that by learning how people used money and power I could
learn how to make a more just society -- but I was never very good at thinking
like a capitalist or a politician, so I needed to change my major. The first
course I took in university was Ethics - and I was immediately hooked. From
there on I studied philosophy full-time, as well as mathematics. I liked math
well enough and took a course or two every semester, enough to earn me a BA in
the subject, but it was never my passion. On the other hand, I received many
accolades for my work in philosophy, and figured that this was going to be my
path. Once I graduated, I was married, and my wife at the time got pregnant with
our only child. I needed a way to make money fast, so I switched to focusing on
software. I had been encouraged to develop games, another hobby I'd had since
middle school, and I was decent enough at programming to find a few good jobs,
working my way from data entry to front-end to full-stack development. This
lasted for a number of years, and I quickly became a well-paid engineer, working
with low-level code in a language developers clamor for, writing code most
programmers would rack their brains to figure out. But I wasn't happy.

Don't get me wrong, I love software and I love mathematics, but they do not, on
their own, _mean_ anything. What meaning is there behind a mathematical
expression, or a piece of code, extracted from its socio-historical context?
And, for the software I am writing, who is using it, and to what end? Am I truly
doing something worthwhile with my life by creating inauthentically, paid well
to interpret the asinine demands of a corporate entity whose end-goal is only to
accumulate capital? Creating software for entertainment conglomerates is a far
cry from creating art authentically. I am not trying to disparage the people I
worked with or the goals of the companies I was at, after all we are all trying
to make a living. Many of the people I know from my career are intelligent,
critical thinkers working within the system against the system. As for me, try
as I might, I couldn't convince myself that what I was doing was worthwhile.
This incoherence was killing me.[^1]

[^1]:
    (_This paragraph discusses sensitive topics related to mental health
    crises._) I never got to study these questions in depth the way I wanted to,
    and it - alongside many other tragic events in my life - literally drove me
    crazy. I have had several suicide attempts since leaving college, and have
    been diagnosed with severe mental health issues relating to trauma and the
    feeling of being generally misplaced. While studying philosophy won't fix me
    psychologically, balancing who I believe myself to be and what I do with my
    time cannot do any harm.

I find myself compelled by the limits of knowledge, with what can and cannot be
rationally expressed, and I longed to find the answers to questions which I had
been chewing on for half a decade. A long-term fascination of mine is the crisis
in the foundations of mathematics in the early 20th century, and the questions
that philosophers and mathematicians have come up with in an attempt to answer
it. These are epistemological, metalogical, and metaphysical questions,
questions about what can be known, what can be expressed rationally, and about
what things there are or possibly could be. But above all what inspires me is
metaethics - the study of the foundational reasons we are compelled toward a
correct way of being, and the puzzle of valuation as such.

As for practical concerns: philosophy is a notoriously difficult subject to get
a career in. If you can manage to get into a highly-ranked university and
graduate _summa cum laude_ you're still not guaranteed a tenure-track job. If
you study aesthetics or continental philosophy, then good luck getting a job at
all. Additionally, philosophy still lags behind other humanities disciplines in
their efforts toward further inclusivity, and it is not known as a safe place
for minorities. Thankfully, the situation is beginning to change, though it
still has a long ways to go. Nonetheless, I feel compelled to apply, and I have
a fruitful career in technology to return to if things fall by the wayside. So
the decision is made: but where to start?

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
CUNY, Toronto, UBC, UCR, Columbia, and Yale. God help me. In addition, I'd like
to apply to Memphis and the Univeristy of Kansas, my alma matter, as backups.

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
