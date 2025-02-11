% RESUME DOCUMENT STYLE -- Released 23 Nov 1989
%    for LaTeX version 2.09

\typeout{Document Style `resume' <26 Sep 89, Dec 07>.}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% @brief    LaTeX2e Resume/References Style Config
% @url      http://profarius.com/content/resume-with-latex
% @date     February 2011
% @author   Michael Lustfield (MTecknology)
% @info     This is a very heavy modification of work done
%           by Kamil K Wojcicki, Chris Paciorek, and Michael
%           DeCorte. The aim was to produce resume.cls that
%           lets the used produce a very clean and easy to
%           read resume.tex file which builds a very pretty
%           resume at the end.
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% You can have multiple style options the legal options ones are:
%
%   centered	the name and address are centered at the top of the
%		page (default)
%
%   line	the name is the left with a horizontal line then 
%		the address to the right
%
%   overlapped	the section titles overlap the body text (default)
%
%   margin	the section titles are to the left of the body text
%		
%   11pt	use 11 point fonts instead of 10 point fonts
%
%   12pt	use 12 point fonts instead of 10 point fonts
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%   Commands - Resume
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%   \Resume	prints the word resume but typeset nicely
%
%   \newsectionwidth{dimen}
%		defines the amount of space the labels extend
%		into the left margin.
%		DO NOT TRY to change any of the dimensions
%		yourself.  You will probably confuse the style file.
%
%   \name{text} defines your name
%
%   \address{text}
%		defines your address
%		this can be called twice if you have two addresses
%		use \\'s to indicate where either line breaks or
%		comas should go
%
%   \opening	this prints your name and address at that spot
%		this is not normally needed, as \begin{resume}
%		does this but is provided just in case you need
%		to do something odd
%
%   \begin{resume} ... \end{resume}
%		all of the resume should go inside of this
%		environment
%
%   \section{text}
%		This prints 'text' in the left hand margin.
%		Its exact placement depends on what the style 
%		options has been set to. (overlapped or margin)
%		You should use \\ to start a new line.	If the
%		style option is margin, the \\ is converted
%		to a space.
%		To use this in any of the list environments, put
%		the \section after the \item[] but before the 
%		text.
%		Eg.
%		\begin{itemize}
%		\item\section{text}
%		text
%		\end{itemize}
%
%
%   \heading{title}{location}{date}[position]
%		'section heading'
%		packed little gem to make printing a section
%		heading pretty and easy
%		the [position] parameter is optional
%
%   \b{title}
%		'section label'
%		prints formatted text for a label
%
%   \begin{resume_list} ... \end{resume_list}
%		modifies an itemized list to better fit pages
%		so more data can fit on one page of the resume.
%
%   \begin{tear} ... \end{tear}
%		creates a two column area to split data
%
%   \begin{ncolumn}{n} ... \end{ncolumn}
%		creates a tabular environment with n equally
%		spaced columns.  Separate columns by & and
%		end them with \\
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%   Commands - References
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% \begin{references} ... \end{references}
%		begin a references page
%
% \begin{reference} ... \end{reference}
%		used to change the way references are ouput.
%               Within a reference, the following commands
%               can be used:
%		\person{text}
%		\jobtitle{text}
%		\business{text}
%		\location{text}
%		\phone{text}
%		\email{text}
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Glue
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% sectionskip	the amount of horizontal before a section
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Dimensions
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% sectionwidth	the amount that the section titles go in the
%		left margin
%
% resumewidth	the width of the total resume from the left
%		margin to the right.  Don't use textwidth
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Definitions
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% sectionfont	the font used to print section titles
%		use \renewcommand to change it
%
% namefont	the font used to print your name
%		use \renewcommand to change it
%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% THINGS TO DO
%
% add lm,rm options to format style to allow things to be placed
% in the left or right margin respectivly
%
% add capability so that \body doesn't have to be proceeded (followed)
% by a \\ allowing part of the description (eg. location) to be the
% first (last) thing of the body
%
% clean up the list building procedures
%
% write docs to tell people how to use this

\NeedsTeXFormat{LaTeX2e}[1995/12/01]
\ProvidesClass{resume}[2000/05/19 v1.4b Resume class]

%\DeclareOption{11pt}{\renewcommand\@ptsize{1}}
%\DeclareOption{12pt}{\renewcommand\@ptsize{2}}

\PassOptionsToClass{11pt,12pt}{article}
\LoadClassWithOptions{article}

\newif\if@line
\newif\if@margin

\DeclareOption{line}{\@linetrue}
\DeclareOption{centered}{\@linefalse}

\DeclareOption{margin}{\@margintrue}
\DeclareOption{overlapped}{\@marginfalse}

\ExecuteOptions{overlapped,centered}
\ProcessOptions\relax

\nofiles	     % resume's don't need .aux files


\newtoks\tabular@text		    % holds the current list being processed
\newtoks\tabular@head		    % holds the head tabular list
\newtoks\tabular@tail		    % holds the tail tabular list
\newtoks\@ta			    % used by \@append
\newtoks\undefined@token\undefined@token={}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% package requirements
%
\usepackage{color}
\usepackage{ifthen}
\usepackage{multicol}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Add colors that can be used later
%
\definecolor{grey}{RGB}{117,117,117}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% prints a centered name with the address centered
% or the two address on opposite sides of the page
%
\def\@printcentername{\begingroup
  % print the name centered
  \leavevmode\hbox to \textwidth{\hfil\@tablebox{\namefont\@name}\hfil}\par
  \@ifundefined{@addressone}{%
    % do nothing
  }{%
    \@ifundefined{@addresstwo}{
      % only one address
      \leavevmode\hbox to \textwidth{\hfil\@tablebox{\@addressone}\hfil}\par
    }{
      % two addresses
      \leavevmode\hbox to \textwidth{\@tablebox{\@addressone}\hfil
				     \@tablebox{\@addresstwo}}\par
    }%
  }%
\endgroup}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% this is used to print the name and address at the top of
% the page with a hline in between
%
\def\namefont{\Huge\bf}
\def\@linename{\begingroup
  \leavevmode\hbox to \textwidth{
    \hfil
    \@tablebox{
      \namefont
      \@name
    }
    \hfil
  }
  \par
  \vskip 8pt
  \fullline
  \@ifundefined{@addressone}{
    % do nothing
  }{%
    \vskip 4pt
    \leavevmode\hbox to \textwidth{
      \hfil
      \hbox{\@addressone}
      \hfil
    }
    \par
    \vskip 3pt
    \fullline
  }
\endgroup}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% HEADINGS:
% There are two types of headings:
% 1) one with the name centered and the address centered or
%    in the left and right side if there are two address
% 2) one where the name is in the upper left corner 
%    the a line accross the paper
%    then the address all on one line in the right corner
%    the second address will be directly below the first if defined
%
\let\print@name\relax
\def\ds@centered{\ifx\print@name\relax\let\print@name\@printcentername\fi}
\def\ds@line{\ifx\print@name\relax\let\print@name\@linename\fi}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% Use this to set the sectionwidth.
% It adjust the width of the text as well as the hoffset
% You probably shouldn't touch any of the size paramaters
% unless you really understand all of this but it is not
% hard.  Either way, it can only be executed once
%
\def\sectionfont{\bf}
\newdimen\sectionwidth
\newskip\sectionskip
\newdimen\resumewidth

\resumewidth=6.5in
\sectionskip=3.5ex plus 1ex minus -.2ex % values stolen from LaTeX

\def\newsectionwidth#1{%
		     \sectionwidth=#1
		     \textwidth=\resumewidth
		     \advance\textwidth-\sectionwidth
		     \hsize=\textwidth
		     \hoffset=\sectionwidth
}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% This is for sectiontitles that are entirely in the left margin.
% multiline sectiontitles are permited and will be broken by
% \TeX{} to fit into a box \verb|\sectionwidth| wide.  It is advised
% that \verb|\\| be used to break the lines by hand as \TeX{} will
% probably not do what you want.
%
% When using this with {\tt tabbing} and {\tt list} (or anything
% that is made out of {\tt list}) put the \section's inside of
% the \verb|\begin{}|  and the \verb|\item|Eg.
% \begin{verbatim}
% \begin{trivlist}
% \item[]
% \section{foo}
% text
% \end{trivlist}
% \end{verbatim}
%
\def\boxed@sectiontitle#1{%
  % this macro may be called in a tabular.  Special code must be written
  % to accomodate this.  In LaTeX, a tabular is made out of hboxes.
  % TeX never goes into horizontal mode because of this; it only
  % gets into vertical mode and restricted horizontal mode.  Certain 
  % indenting problems must be handled because of this.  They
  % are delt with at the end of this routine.
  % It is also necessary to close the hbox that was created before
  % the \section and create a new one when this macro has ended.
  % This macro therefore simulates a \kill, so that any text before
  % the \section not be printed.  The proper use is therefore
  % ...
  % text\\
  % \section{foo}
  % more text\\
  % ...
  \ifx\\\@tabcr    % is this in a tabular? (this *should* work but is a cludge)
    \@stopfield    % the is the first part of a \kill
   \else
     \@@par	     % This will end the previous paragraph if needed and
		   % go into vertical mode.  If this was already in
		   % vertical mode then the \par does nothing.

  \fi
  \begingroup
  \everypar={}%
  \def\par{\@@par}%
  \let\\=\@normalcr
  \addpenalty{\@secpenalty} % this would be a good place for a page break
			    % \@secpenalty is what LaTeX uses before its
			    % section's.  It happens to be -300
  \addvspace{\sectionskip}  % put in a bit of glue
  % The following hbox will be contributed to the page list without going
  % into horizontal mode.  Therefore, any \parindent's, \parshape's, \leftskip
  % will be ignored but \hoffset's are not.  The result is that the box will
  % only by \hoffset. This is what I want
  \hbox to 0pt{%
    \hss	 % this is an llap.  In other words, this glue
		 % will shrink by the width of the stuff in the vbox
		 % (\sectionwidth) into the left margin and then
		 % insert the contents of the vbox.
    \vtop to 0pt{% make a 0pt height paragraph, with the baseline at the
		 % lined up with the baseline of the first box in the list
      \leftskip=0pt
      \hsize=\sectionwidth
      \textwidth=\sectionwidth
      \raggedright       % you don't want this filled out to the right margin
      \sectionfont
      \textcolor{grey}{  % Make the color grey
        \mysidestyle     % Add extra styling
        #1\vss	         % Go into horizontal mode; do the paragraph;
		         % go into vertical mode; add some negative glue 
		         % to give a box of 0pt height and depth
      }
    }%
  }%
  \addpenalty{-\@secpenalty} % this would be a bad place for a page break
  \vskip-\baselineskip % when the next box is processed, baselineskip glue
		       % glue will be added (the box has no depth because of
		       % the \vss; therefore, we don't have to worry about
		       % \lineskiplimit).  This -\baselineskip glue
		       % is to undo this.  \nointerlineskip doesn't
		       % work because the baseline of this line would be lined
		       % up with the top of the top of the next box.  We
		       % want the baselines lined up.
		       %
		       % It may have been possible to do this by forcing the
		       % baseline of this box to be the top of the box but
		       % then the interline skip between this box and the
		       % previous box would be off as the baselines of the
		       % this box (the one that being made above) and the
		       % previous line would be separated by \baselineskip
		       % (probably, it may be separted by the depth of the
		       % previous box + \lineskip) but as the baseline of
		       % this box has been moved to the top, the box's would
		       % separted by to much glue.  The exact amount being
		       % the height of this box.
  \endgroup
  \ifx\\\@tabcr   % is this in a tabular? (this *should* work but is a cludge)
    % this is the second part of the \kill; it starts the next tabbing line
    % Because this routine will never get into paragraph mode when used in
    % tabbing the \parskip that is discussed below will never be inserted.
    % Therefore it should not be negated as done below.
    \@startline
    \ignorespaces
  \else
    \vskip-\parskip    % The next thing to be contributed will be a paragraph.
		       % Right before being contributed though a \vskip\parskip
		       % will be inserted.  This is to negate it.
		       %
		       % I do consider this to be a bit of a cludge but
		       % I can not find a way to write \unskipfutureskip
		       % or a way to make TeX think that nothing has
		       % been contributed to the page list.
  \fi
}


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% This is for sectiontitles that are entirely above the section text
%
\def\unboxed@sectiontitle#1{%
  \ifx\\\@tabcr % see boxed@sectiontitle for explation
    \@stopfield
   \else
     \@@par
  \fi
  \begingroup
  \everypar={}%
  \def\par{\@@par}%
  \def\\{ }
  \addpenalty{\@secpenalty}
  \addvspace{\sectionskip}
  \hbox to 0pt{\hss\hbox to \sectionwidth{\sectionfont#1\hss}}
  \addpenalty{-\@secpenalty} % this would be a bad place for a page break
  \endgroup
  \ifx\\\@tabcr   % see boxed@sectiontitle for explation
    \@startline
  \else
    \vskip-\parskip
  \fi
  \ignorespaces
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% There are two types of section headings:
% 1) the section heading is all on one line and directly
%    below it, is the body of the text
% 2) the section heading is entirely in the left margin
%    (possibly taking multiple lines) with the body of
%    the text next to it
%
\let\@@section\relax
\def\ds@overlapped{\ifx\@@section\relax\newsectionwidth{0.5in}\let\@@section\unboxed@sectiontitle\fi}
\def\ds@margin{\ifx\@@section\relax\newsectionwidth{0.9in}\let\@@section\boxed@sectiontitle\fi}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% DEFAULTS: (some of them)
%
% centered name
% overlapped section titles
%

\if@line\ds@line\else\ds@centered\fi
\if@margin\ds@margin\else\ds@overlapped\fi


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% typeset resume all nice and pretty
%
\def\Resume{{R\'{e}sum\'{e}}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% makes a line of width \textwidth starting at -\hoffset
%
\def\fullline{		% hrules only listen to \hoffset
  \nointerlineskip	% so I have this code	  
  \moveleft\hoffset\vbox{\hrule width\textwidth} 
  \nointerlineskip
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% create a multiline box.
%
\def\@tablebox#1{\begin{tabular}[t]{@{}l@{\extracolsep{\fill}}}#1\end{tabular}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% use this to define your name
%
\def\name#1{\def\@name{#1}}

\def\@name{}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% use this to define your address, this may be called more than once.
%
\let\@addressone\relax
\let\@addresstwo\relax

\def\address#1{
  \@ifundefined{@addressone}{\def\@addressone{#1}}{\def\@addresstwo{#1}}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% if you want to print your name and address is a slightly
% different format than sugessted, then this can be used
% to place it exactly where you want
%
\def\opening{\def\@opening{}
  \begingroup
  \leftskip=-\hoffset	     % I use leftskip to move things to the left as 
  \advance\textwidth\hoffset % changing hoffset doesn't work. But this
  \hsize=\textwidth	     % doesn't really work as hboxes are rules
			     % are unaffeted
  \let\par=\@@par
  \parindent=0pt
  \parskip=0pt
  \print@name
  \endgroup
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% all of the resume goes in the resume environment
%
\newenvironment{resume}{\begingroup
		       \footnotesize
		       \@ifundefined{@opening}{\opening}{}
}{\endgroup}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% an environment similar to the resume for a references list
%
\newenvironment{references}{%
  \begingroup
    \footnotesize
}{%
  \endgroup
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% use an itemized list but modify it some
%
\newenvironment{resume_list}{
  \begin{itemize}
    \vskip -12pt
    \itemsep -2pt
    \vskip -12pt
}{
  \end{itemize}
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% split data into two columns
%
\newenvironment{tear}{
  \vskip -12pt
  \begin{multicols}{2}
}{
  \end{multicols}
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% use this to define a section heading with an optional
% fourth paramater
%
\def\heading#1#2#3{
  \@ifnextchar[{
    \sectionheader{#1}{#2}{#3}%
  }{
    \sectionheader{#1}{#2}{#3}[]%
  }
}

\def\sectionheader#1#2#3[#4]{
  {\bf #1}	% {title}
  #2		% {location}
  \hfill
  {\bf #3}%	% {date}
  \ifthenelse{%
    \equal{#4}{}%
  }{%
    % do nothing
  }{
    \\
    \emph{#4}	% [position]
  }%
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% use this to define a section label
%
\renewcommand{\b}[1]{
  {\bf #1}%
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% define a set of commands that are used for the
% \makereference command
%
%  commands defined:
%   \person{text}
%   \jobtitle{text}
%   \business{text}
%   \location{text}
%   \phone{text}
%   \email{text}
%

\newcommand{\@person}{}
\newcommand{\@jobtitle}{}
\newcommand{\@business}{}
\newcommand{\@location}{}
\newcommand{\@citystatezip}{}
\newcommand{\@phone}{}
\newcommand{\@email}{}

\newcommand{\person}[1]  {\renewcommand{\@person}{#1}}
\newcommand{\jobtitle}[1]{\renewcommand{\@jobtitle}{#1}}
\newcommand{\business}[1]{\renewcommand{\@business}{#1}}
\newcommand{\location}[1]{\renewcommand{\@location}{#1}}
\newcommand{\citystatezip}[1]{\renewcommand{\@citystatezip}{#1}}
\newcommand{\phone}[1]   {\renewcommand{\@phone}{#1}}
\newcommand{\email}[1]   {\renewcommand{\@email}{#1}}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% build text for a reference
%
\newcommand{\makereference}{%
  \begingroup
    \parindent2in
    \parskip0pt
    \ifthenelse{\equal{\@person}{}}  {}{\textbf{\@person}\par}%
    \ifthenelse{\equal{\@jobtitle}{}}{}{\textit{\@jobtitle}\par}%
    \ifthenelse{\equal{\@business}{}}{}{\@business\par}%
    \ifthenelse{\equal{\@location}{}}{}{\@location\par}%
    \ifthenelse{\equal{\@citystatezip}{}}{}{\@citystatezip\par}%
    \ifthenelse{\equal{\@phone}{}}   {}{\@phone\par}%
    \ifthenelse{\equal{\@email}{}}   {}{\@email\par}%
    \null\par
  \endgroup
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% this is used to define how the reference should appear
%
\newenvironment{reference}{
}{%
  \makereference
}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% CHAA006%vaxb.rhbnc.ac.uk@NSS.Cs.Ucl.AC.UK
% texhax.88.078
% is used to see if two token lists are equal
% there must be a better way
%

\let \then = \empty
\def \iftoks #1#2\then #3\else #4\skotfi{
		\edef \1{\the #1}
		\edef \2{\the #2}
		\ifx \1\2\then #3\else #4\fi}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% DEFAULTS: (the rest of them)
%
% centered name
% overlapped section titles

\@secpenalty = -500
\topmargin 0pt
\headheight 0pt
\headsep 0pt
\textheight 9in
\parindent 0pt
\topmargin 0in
\oddsidemargin 0pt
\evensidemargin 0pt
\marginparwidth 0pt
\parindent 0pt
\parskip \baselineskip
\setcounter{secnumdepth}{0}
\def\@listI{\leftmargin\leftmargini
\topsep 0pt 
\parskip 0pt
\partopsep 10pt plus 2pt
\parsep 2pt plus 2pt
\itemsep \parsep}

\pagestyle{empty}  % don't want page numbers

\let\section\@@section

\oddsidemargin -11mm
\evensidemargin -11mm
%\textwidth=150mm
\textwidth=6.5in
\itemsep=0cm
\parsep=0cm
%\topmargin -18mm
\topmargin -13mm
\textheight 265mm
%\textheight 275mm

\newcommand{\mysidestyle}{\small\sc}
\newcommand{\myheadingstyle}{\sl}
\newcommand{\mysubheadingstyle}{\sl}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%