import { Button, Card, Col, Row } from 'react-bootstrap';
import Layout from '../components/layout';

function About() {
  return (
    <Layout>
      <h1 className="mt-3">About MusicCPR</h1>
      {/* <Row> */}
      <Card style={{ width: '18rem' }} className="float-end ml-4">
        <Card.Img
          variant="top"
          src="https://res.cloudinary.com/scalefunder/image/upload/c_crop,h_2938,w_5184,x_0,y_68/c_scale,h_170,w_300/f_auto,fl_lossy,q_auto/v1/James_Madison_University/q4uzdgpi5evlfvrcj3qz"
        />
        <Card.Body>
          <Card.Title>Support us</Card.Title>
          <Card.Text>
            If you would be interested in supporting our project, click below.
          </Card.Text>
          <a
            className="btn btn-success"
            target="_blank"
            rel="noopener noreferrer"
            href="https://dukesfunder.jmu.edu/project/30270"
          >
            Learn more
          </a>
        </Card.Body>
      </Card>
      <p>
        MusicCPR is a free web-based platform to promote standards-based
        instrumental music education. MusicCPR aligns with four artistic
        processes found in{' '}
        <a href="https://nafme.org/my-classroom/standards/">
          National Standards for Music Education
        </a>
        : create, perform, respond, and connect and their manifestations in
        state standards for instrumental music education (e.g., New York's{' '}
        <a href="http://www.nysed.gov/curriculum-instruction/arts-standards-implementation-resources">
          Arts Learning Standards
        </a>
        , Virginia's{' '}
        <a href="https://doe.virginia.gov/testing/sol/standards_docs/fine_arts/2020/2020fasol-music.pdf">
          Music Standards of Learning
        </a>
        ).
      </p>
      {/* <Col> */}

      <p>
        We provide teachers with research-based and standards-aligned tools for
        facilitating and assessing individual students' music learning. These
        tools connect with established repertoire on state music education
        association lists, as well as newly commissioned repertoire that
        highlights underrepresented musics and composers.
      </p>
      <p>
        MusicCPR is housed at James Madison University, in a collaboration
        between the{' '}
        <a href="https://jmu.edu/cs">Department of Computer Science</a> and the{' '}
        <a href="https://www.jmu.edu/arts/ocp/index.shtml">
          Office of Creative Propulsion
        </a>{' '}
        with collaborators at{' '}
        <a href="https://rochester.edu/">University of Rochester</a>'s{' '}
        <a href="https://www.esm.rochester.edu/">Eastman School of Music</a> and
        in <a href="https://www.udel.edu/">University of Delaware</a>'s{' '}
        <a href="https://www.music.udel.edu/">School of Music</a>. MusicCPR's
        development has been supported by these institutions, as well as{' '}
        <a href="https://4-va.org/">4-VA Collaborative</a> and{' '}
        <a href="https://nafme.org/">
          National Association for Music Education
        </a>
        .
      </p>
      <p>
        If you're interested in trying MusicCPR, or have a question for the
        team, don't hesitate to drop us a line at{' '}
        <a href="mailto:feedback@musiccpr.org">feedback@musiccpr.org</a>
      </p>
      {/* </Col>
        <Col sm={3}>
          <h3>Support MusicCPR</h3>
          <p>
            If you would be interested in supporting our project, click below.
          </p>
          <a href="https://dukesfunder.jmu.edu/project/30270" target="_blank" rel="noopener noreferrer" className='btn btn-info'> Learn more</a>
        </Col>
      </Row> */}

      <h2>Investigators</h2>

      <ul>
        <li>
          <a href="https://www.esm.rochester.edu/directory/caravan-lisa/">
            Lisa R. Caravan, DMA
          </a>{' '}
          (Assistant Professor, Department of Music Teaching and Learning,
          Eastman School of Music, University of Rochester)
        </li>
        <li>
          <a href="https://www.esm.rochester.edu/directory/snell-alden/">
            Alden H. Snell, II, Ph.D.
          </a>{' '}
          (Associate Professor, Department of Music Teaching and Learning,
          Eastman School of Music, University of Rochester)
        </li>
        <li>
          <a href="https://hcientist.com">Michael C. Stewart, Ph.D.</a>{' '}
          (Assistant Professor of Computer Science, James Madison University)
        </li>
        <li>
          <a href="https://www.jmu.edu/arts/people/stringham-david.shtml">
            David A. Stringham, Ph.D.
          </a>{' '}
          (Professor of Music; Executive Director, Office of Creative
          Propulsion, James Madison University)
        </li>
      </ul>
      <h2>Collaborators</h2>
      <ul>
        <li>
          Abdullah Mohammed Ali (Undergraduate Student, James Madison
          University)
        </li>
        <li>
          <a href="https://www.linkedin.com/in/alexdumo/">Alex Dumouchelle</a>{' '}
          (Undergraduate Student, James Madison University)
        </li>
        <li>Jonah Giblin (Undergraduate Student, James Madison University)</li>
        <li>
          <a href="http://benguerrero.com/">Benjamin Guerrero, MM</a> (Preparing
          Future Faculty Fellow, James Madison University; Ph.D. Candidate,
          University of Rochester)
        </li>
        <li>
          Thomas Hassett (Undergraduate Student Alumnus, School of Music;
          Innovation Leader, Center for Inclusive Music Engagement; James
          Madison University)
        </li>
        <li>
          Heidi Lucas, DMA (Visiting Assistant Professor of Brass and Music
          Education, University of Delaware)
        </li>
        <li>
          Brandon McKean (Systems Administrator, Department of Computer Science,
          James Madison University)
        </li>
        <li>
          Pete Morris (Systems Administrator, Department of Computer Science,
          James Madison University)
        </li>
        <li>Zamua Nasrawt (Consulting Musician and Web Developer)</li>
        <li>
          <a href="https://github.com/LiemKN/">
            Liem Nguyen (Undergraduate Student, James Madison University)
          </a>
        </li>
        <li>
          Meara Patterson (Undergraduate Student, James Madison University)
        </li>
        <li>
          <a href="https://www.jmu.edu/cise/people/faculty/riley-philip.shtml">
            Phil Riley
          </a>{' '}
          (Lecturer in Computer Science, James Madison University)
        </li>
        <li>Isaiah Ortiz (Undergraduate Student, James Madison University)</li>
        <li>Nathan Self (Consulting Musician and Web Developer)</li>
        <li>
          <a href="http://pawelwozniak.eu/">Paweł W. Woźniak, Ph.D.</a>{' '}
          (Associate Professor, Interaction Design and Software Engineering
          division, Department of Computer Science and Engineering, Chalmers
          University)
        </li>
        <li>
          <a href="https://laurenyz.github.io/portfolio/">Lauren Yu</a> (Web
          Developer)
        </li>
      </ul>
    </Layout>
  );
}

export default About;
