function [ ] = Quiz( )
%Multimedia Cartography (FS 2014)
%
% The Olympic Game - Quiz
%
%--------------------------------------------------------------------------
%
%   MAIN - PROGRAMM
%
%--------------------------------------------------------------------------
%
% A game about the Swiss Olympic medal winners. Aim of this game is it, to
% achieve as much as possible points while guessing the "place of birth" of
% the medal winners.
%
%--------------------------------------------------------------------------
%
% Version 1.0                       by Andreas B.G. Baumann (17.3.2014)
%
%--------------------------------------------------------------------------

% Number of athlets
noOfQuestions = 5;

% Load all medalist with a "place of birth"
[medalist, noOfMedals] = LoadData();

% Load an orthophoto image
LoadMap('Quiz Game');
hold on

% Compute arbitary list of medal winners
random = ceil(rand(noOfQuestions,1)* noOfMedals);

for i=1:noOfQuestions
    
    % Delete the drawn point and lines of the previous question
    if i ~= 1
        delete(circle1);
        delete(circle2);
        delete(line1);
    end
    
    % Get the name of the current athlet
    name = [medalist{random(i),2},' ',medalist{random(i),1}];
    
    % Get the coordinates of the current athlet
    latTrue = medalist{random(i),8};
    lonTrue = medalist{random(i),9};
    
    % Question
    fprintf(['Where does/did ',name,' come from?\n'])    

    % Receiving the users answer
    [lonUser,latUser] = ginput(1);
    
    % Compute the distance with an external MATLAB-Code
    dist = round(vdist(latTrue,lonTrue,latUser,lonUser)/1000);  % [km]
    
    % Compute the achieved point 
    point(i) = PointCalc(dist);                                 % [0,500]
    
    % Draw a line and two points of the true and guessed coordinates
    line1 = line([lonTrue,lonUser],[latTrue,latUser],'Color','g');
    circle1 = scatter(lonTrue,latTrue,'MarkerEdgeColor','g','MarkerFaceColor','g');
    circle2 = scatter(lonUser,latUser,'MarkerEdgeColor','r','MarkerFaceColor','r');
    
    % Answer
    fprintf([num2str(point(i)),' points\n'])
    fprintf(['Total: ',num2str(sum(point)),' points\n\n'])
    
    % Wait for user input (so she/he can see the points/line)
    waitforbuttonpress;
end


end

